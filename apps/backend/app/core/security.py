"""JWT creation and verification.
Two token types share one secret and algorithm: a short access token that
authorises requests, and a longer refresh token that mints new access tokens.
The refresh token carries a jti (unique id) so it can be individually revoked
via the Redis allowlist in token_store.py.
"""

import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from app.core.config import settings


def _now() -> datetime:
     # Single source of "now", always timezone-aware UTC. Keeps iat/exp
    # consistent and makes the functions easy to reason about.
    return datetime.now(UTC)


def create_access_token(subject: str, extra: dict[str, Any] | None = None) -> str:
    now = _now()
    payload: dict[str, Any] = {
        "sub": subject,  # who the token is for (our user id)
        "type": "access", # tag the kind so decode_token can reject the wrong one
        "iat": now,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    if extra:
        # Optional extra claims, merged in if a caller needs them
        payload.update(extra)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(subject: str) -> tuple[str, str]:
    now = _now()
    # jti is the handle we store in Redis. Returning it alongside the token
    # lets the caller record it in the allowlist.
    jti = secrets.token_urlsafe(32)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": "refresh",
        "jti": jti,
        "iat": now,
        "exp": now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return token, jti


def decode_token(token: str, expected_type: str) -> dict[str, Any] | None:
    # Returns the payload on success, None on any failure. Callers treat None
    # as "not authenticated" rather than us raising, so the auth routes stay
    # clean.
    try:
        payload: dict[str, Any] = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "iat", "sub", "type"]},
        )
    except ExpiredSignatureError:
        return None
    except InvalidTokenError:
        return None
    # A valid signature isn't enough: an access token must not be usable where
    # a refresh token is expected, and vice versa. Reject a type mismatch.
    if payload.get("type") != expected_type:
        return None
    # A refresh token must carry a jti so it can be revoked; reject if missing.
    if expected_type == "refresh" and not payload.get("jti"):
        return None
    return payload
