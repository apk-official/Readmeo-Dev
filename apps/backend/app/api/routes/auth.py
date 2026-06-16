from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.db.redis import get_redis
from app.db.session import get_db
from app.schema.token import TokenResponse
from app.schema.user import UserPublic
from app.services import github_oauth, token_store
from app.services.auth_service import upsert_user_from_github

router = APIRouter(prefix="/auth", tags=["auth"])

_REFRESH_COOKIE = "refresh_token"

DbDep = Annotated[AsyncSession, Depends(get_db)]
RedisDep = Annotated[Redis, Depends(get_redis)]


def _set_refresh_cookie(response: Response, token: str) -> None:
    """Set the refresh token as an httpOnly cookie. Not readable by JS."""
    response.set_cookie(
        key=_REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=not settings.DEBUG,  # require HTTPS in prod; relax for local dev
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/auth",
    )


# ─── Step 1: start login ──────────────────────────────────────

@router.get("/login")
async def login(redis: RedisDep) -> RedirectResponse:
    """Generate state, stash it in Redis, redirect the browser to GitHub."""
    state = github_oauth.generate_state()
    await token_store.store_state(redis, state)
    url = github_oauth.build_authorize_url(state)
    return RedirectResponse(url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)


# ─── Step 3-7: handle GitHub's callback ───────────────────────

@router.get("/callback")
async def callback(
    code: str,
    state: str,
    db: DbDep,
    redis: RedisDep,
) -> RedirectResponse:
    """Verify state, exchange code, upsert user, issue our tokens."""
    # 3. CSRF check: the state must be one we issued and haven't used.
    if not await token_store.consume_state(redis, state):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OAuth state",
        )

    # 4. Trade code for a GitHub token, then fetch the profile.
    try:
        token_data = await github_oauth.exchange_code_for_token(code)
        profile = await github_oauth.fetch_github_user(token_data["access_token"])
    except github_oauth.GitHubOAuthError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"GitHub authentication failed: {exc}",
        ) from exc

    # 5. Upsert the user (token encrypted inside the service).
    user = await upsert_user_from_github(
        db,
        profile=profile,
        github_token=token_data["access_token"],
        scopes=token_data["scope"],
    )

    # 6. Issue our own tokens; record the refresh jti in Redis.
    access_token = create_access_token(subject=str(user.id))
    refresh_token, jti = create_refresh_token(subject=str(user.id))
    await token_store.store_refresh_jti(redis, user.id, jti)

    # Both the user row and the Redis write succeeded → commit together.
    await db.commit()

    # 7. Refresh token in an httpOnly cookie; redirect back to the frontend.
    redirect = RedirectResponse(
        f"{settings.FRONTEND_URL}/auth/complete?access_token={access_token}",
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    )
    _set_refresh_cookie(redirect, refresh_token)
    return redirect


# ─── Refresh: rotate tokens ───────────────────────────────────

@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    request: Request,
    response: Response,
    redis: RedisDep,
) -> TokenResponse:
    """Issue a new access token from a valid refresh token, rotating it."""
    token = request.cookies.get(_REFRESH_COOKIE)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        )

    payload = decode_token(token, expected_type="refresh")
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    old_jti = payload["jti"]
    # Revocation check: is this jti still in the allowlist?
    if not await token_store.is_refresh_jti_valid(redis, old_jti):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
        )

    user_id = payload["sub"]
    # Rotate: invalidate the old jti, issue a fresh pair.
    await token_store.revoke_refresh_jti(redis, old_jti)
    new_refresh, new_jti = create_refresh_token(subject=user_id)
    await token_store.store_refresh_jti(redis, int(user_id), new_jti)
    access_token = create_access_token(subject=user_id)

    _set_refresh_cookie(response, new_refresh)
    return TokenResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


# ─── Logout ───────────────────────────────────────────────────

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request,
    response: Response,
    redis: RedisDep,
) -> None:
    """Revoke the refresh token and clear the cookie."""
    token = request.cookies.get(_REFRESH_COOKIE)
    if token:
        payload = decode_token(token, expected_type="refresh")
        if payload is not None:
            await token_store.revoke_refresh_jti(redis, payload["jti"])
    response.delete_cookie(_REFRESH_COOKIE, path="/auth")


# ─── Current user ─────────────────────────────────────────────

@router.get("/me", response_model=UserPublic)
async def me(user: CurrentUser) -> UserPublic:
    """Return the authenticated user's public profile."""
    return UserPublic.model_validate(user)