"""The Portfolio model: one user's saved site, the source of truth.

Postgres owns the portfolio; KV only serves rendered copies. So everything
here is source data, never rendered output. The full design+content lives in
the `artifact` JSONB; the separate columns are the things we look up or filter by.
"""

from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(primary_key=True)

    # unique => one portfolio per user in V1.
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )

    # Worker resolves username.gitbunny.dev -> this row, so it's indexed.
    subdomain: Mapped[str] = mapped_column(String(63), unique=True, index=True)

    template_id: Mapped[str] = mapped_column(String(64), index=True)
    scheme_id: Mapped[str] = mapped_column(
        String(64), default="dark", server_default="dark"
    )
    accent: Mapped[str | None] = mapped_column(String(32), nullable=True)

    # Mirrors the artifact's own version, so we can find stale rows with a plain WHERE.
    schema_version: Mapped[int] = mapped_column(Integer, default=1)

    # The whole { design, content } object. Validated via the Artifact schema in the app layer.
    artifact: Mapped[dict[str, Any]] = mapped_column(JSONB)

    # Draft vs. live. The Worker only serves published portfolios.
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)

    # KV deploy tracking. If updated_at > last_deployed_at, the live copy is stale.
    last_deployed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    deployed_version: Mapped[int | None] = mapped_column(Integer, default=None)
    last_deploy_error: Mapped[str | None] = mapped_column(String, default=None)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Portfolio id={self.id} subdomain={self.subdomain!r}>"
