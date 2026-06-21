"""User persistence for the OAuth flow.

Takes a GitHub profile and turns it into a row in our users table: creates the
user on first login, updates their details on every login after. The GitHub
token is encrypted before it's stored.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.crypto import encrypt
from app.models.user import User


async def upsert_user_from_github(
    db: AsyncSession,
    *,
    profile: dict,
    github_token: str,
    scopes: str,
) -> User:
    github_id = profile["id"]
    # Encrypt before it touches the DB; the plaintext token never gets stored.
    encrypted_token = encrypt(github_token)

    result = await db.execute(select(User).where(User.github_id == github_id))

    user = result.scalar_one_or_none()

    if user is None:
         # First time we've seen this GitHub account: create the row.
        user = User(
            github_id=github_id,
            github_username=profile["login"],
            email=profile.get("email"),
            avatar_url=profile.get("avatar_url"),
            encrypted_github_token=encrypted_token,
            token_scopes=scopes,
        )
        db.add(user)
    else:
        # Returning user: refresh the details that may have changed since last
        # login, including a possibly re-scoped token.
        user.github_username = profile["login"]
        user.email = profile.get("email")
        user.avatar_url = profile.get("avatar_url")
        user.encrypted_github_token = encrypted_token
        user.token_scopes = scopes
    # flush sends the INSERT/UPDATE so the row gets its id; refresh loads any
    # DB-side defaults back onto the object. The caller owns the commit.
    await db.flush()
    await db.refresh(user)
    return user
