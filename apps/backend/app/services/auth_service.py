from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.crypto import encrypt
from app.models.user import User


async def upsert_user_from_github(
        db:AsyncSession,
        *,
        profile:dict,
        github_token:str,
        scopes:str,
)->User:
    github_id = profile["id"]
    encrypted_token = encrypt(github_token)

    result = await db.execute(select(User).where(User.github_id==github_id))

    user=result.scalar_one_or_none()

    if user is None:
        user=User(
            github_id = github_id,
            github_username=profile["login"],
            email=profile.get("email"),
            avatar_url=profile.get("avatar_url"),
            encrypted_github_token=encrypted_token,
            token_scopes=scopes,
        )
        db.add(user)
    else:
        user.github_username = profile["login"]
        user.email = profile.get("email")
        user.avatar_url = profile.get("avatar_url")
        user.encrypted_github_token = encrypted_token
        user.token_scopes = scopes

    await db.flush()
    await db.refresh(user)
    return user