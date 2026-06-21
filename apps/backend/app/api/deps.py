from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

_bearer = HTTPBearer(auto_error=False)

_credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    if credentials is None:
        raise _credentials_exception

    payload = decode_token(credentials.credentials, expected_type="access")

    if payload is None:
        raise _credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise _credentials_exception

    user = await db.get(User, int(user_id))
    if user is None:
        raise _credentials_exception

    if not user.is_active:
        # Token is valid and the user exists, but a disabled account shouldn't get
        # through. Distinct 403 here since the credentials themselves were fine.
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    return user

# Shorthand so routes write `user: CurrentUser` instead of repeating the full
# Depends(get_current_user) annotation everywhere.
CurrentUser = Annotated[User, Depends(get_current_user)]
