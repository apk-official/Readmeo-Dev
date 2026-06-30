"""User model.
One row per GitHub account that has logged in. Holds the GitHub identity, the
encrypted access token, and the granted scopes. Most fields are nullable
because GitHub doesn't guarantee an email or avatar on every profile.
"""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    # GitHub's numeric id is the stable identity we match on; username and
    # email can change, this can't. Unique + indexed since every login looks
    # the user up by it.
    github_id: Mapped[int] = mapped_column(unique=True, index=True)
    # 39 is GitHub's max username length.
    github_username: Mapped[str] = mapped_column(String(39), index=True)
    email: Mapped[str | None] = mapped_column(String(320), index=True)
    avatar_url: Mapped[str | None] = mapped_column(String(512))
    # Stored encrypted (see crypto.py); never the raw token.
    encrypted_github_token: Mapped[str | None] = mapped_column(String)
    # Which scopes the stored token was granted, so we know if we need to
    # re-auth for write access.
    token_scopes: Mapped[str | None] = mapped_column(String)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    # Timestamps set by the DB itself (server_default), so they're correct
    # regardless of app clock. updated_at bumps on every change via onupdate.
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} github_username={self.github_username!r}>"
