"""Portfolio service: create, update, and read a user's portfolio.

The DB column stores a plain dict; the app works with the typed Artifact
model. This service is the boundary that converts between them — validate an
Artifact on the way in, dump to dict to store, rebuild the Artifact on read.

None of these commit. The caller (route) owns the transaction boundary, same
as auth_service.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.portfolio import Portfolio
from app.schema.artifact import Artifact


async def get_portfolio_by_user(db: AsyncSession, user_id: int) -> Portfolio | None:
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == user_id))
    return result.scalar_one_or_none()


async def get_portfolio_by_subdomain(db: AsyncSession, subdomain: str) -> Portfolio | None:
    result = await db.execute(select(Portfolio).where(Portfolio.subdomain == subdomain))
    return result.scalar_one_or_none()


async def upsert_portfolio(
    db: AsyncSession,
    *,
    user_id: int,
    subdomain: str,
    template_id: str,
    scheme_id: str,
    artifact: Artifact,
) -> Portfolio:
    """Create or update the portfolio for a user.

    One portfolio per user (user_id is unique), so we match on user_id.
    The artifact is stored as a dict; schema_version is mirrored out of it
    so we can find stale rows without opening the JSONB.
    """
    portfolio = await get_portfolio_by_user(db, user_id)

    if portfolio is None:
        portfolio = Portfolio(
            user_id=user_id,
            subdomain=subdomain,
            template_id=template_id,
            scheme_id=scheme_id,
            schema_version=artifact.schema_version,
            artifact=artifact.model_dump(mode="json"),
        )
        db.add(portfolio)
    else:
        portfolio.subdomain = subdomain
        portfolio.template_id = template_id
        portfolio.scheme_id = scheme_id
        portfolio.schema_version = artifact.schema_version
        portfolio.artifact = artifact.model_dump(mode="json")

    await db.flush()
    await db.refresh(portfolio)
    return portfolio


def load_artifact(portfolio: Portfolio) -> Artifact:
    """Rebuild the typed Artifact from the stored dict."""
    return Artifact(**portfolio.artifact)
