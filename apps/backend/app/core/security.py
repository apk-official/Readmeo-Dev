import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from app.core.config import settings


def _now() -> datetime:
    return datetime.now(UTC)


def create_access_token(subject: str, extra: dict[str, Any] | None = None) -> str:
    now = _now()
    payload: dict[str, Any] = {
        "sub": subject,
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(subject: str) -> tuple[str, str]:
    now = _now()
    jti = secrets.token_urlsafe(32)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": "refresh",
        "jti": jti,
        "iat": now,
        "exp": now + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return token, jti


def decode_token(token: str, expected_type: str) -> dict[str, Any] | None:
    try:
        payload: dict[str, Any] = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except ExpiredSignatureError:
        return None
    except InvalidTokenError:
        return None

    if payload.get("type") != expected_type:
        return None
    return payload
