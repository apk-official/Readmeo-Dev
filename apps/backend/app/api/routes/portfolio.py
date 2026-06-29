"""Portfolio routes.
    Endpoint for getting and storing portfolio.
    Used versioning in it /api/v1/

"""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser
from app.db.session import get_db
from app.schema.portfolio import (
    DeployStatus,
    PortfolioCreate,
    PortfolioRead,
    SchemeUpdate,
    StyleUpdateResult,
    SubdomainRead,
    SubdomainUpdate,
    TemplateUpdate,
)
from app.services import kv_service, portfolio_service

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.put("/me", response_model=PortfolioRead)
async def upsert_my_portfolio(
    payload: PortfolioCreate,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create or replace the current user's portfolio."""
    try:
        portfolio = await portfolio_service.upsert_portfolio(
            db,
            user_id=user.id,
            subdomain=payload.subdomain,
            template_id=payload.template_id,
            artifact=payload.artifact,
        )
        await db.commit()
    except IntegrityError:
        # Almost always the unique subdomain: someone else already has it.
        await db.rollback()
        raise HTTPException(  # noqa: B904
            status_code=status.HTTP_409_CONFLICT,
            detail="That subdomain is already taken",
        )
    await db.refresh(portfolio)
    return portfolio


@router.get("/me", response_model=PortfolioRead)
async def get_my_portfolio(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No portfolio yet",
        )
    return portfolio


@router.post("/me/deploy", response_model=DeployStatus)
async def deploy_portfolio(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Push the artifact to KV and mark the portfolio as live."""
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No portfolio yet")

    try:
        await kv_service.put_artifact(portfolio.subdomain, portfolio.artifact, template_id=portfolio.template_id,  # noqa: E501
        scheme_id=portfolio.scheme_id)
    except Exception as e:
        portfolio.last_deploy_error = str(e)
        await db.commit()
        raise HTTPException(  # noqa: B904
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to push to Cloudflare KV",
        )
    portfolio.is_published = True
    portfolio.last_deployed_at = datetime.now(UTC)
    portfolio.deployed_version = portfolio.schema_version
    portfolio.last_deploy_error = None
    await db.commit()
    await db.refresh(portfolio)
    return DeployStatus(
        is_published=portfolio.is_published,
        last_deployed_at=portfolio.last_deployed_at,
        last_deploy_error=portfolio.last_deploy_error,
    )


@router.delete("/me/deploy", response_model=DeployStatus)
async def undeploy_portfolio(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Remove the artifact from KV and take the portfolio offline."""
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No portfolio yet")

    try:
        await kv_service.delete_artifact(portfolio.subdomain)
    except Exception:
        raise HTTPException(  # noqa: B904
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to remove from Cloudflare KV",)

    portfolio.is_published = False
    await db.commit()
    await db.refresh(portfolio)
    return DeployStatus(
        is_published=portfolio.is_published,
        last_deployed_at=portfolio.last_deployed_at,
        last_deploy_error=portfolio.last_deploy_error,
    )


@router.patch("/me/subdomain", response_model=SubdomainRead)
async def change_subdomain(
    payload: SubdomainUpdate,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Change the subdomain. If live, migrates the KV key automatically."""
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No portfolio yet")

    old_subdomain = portfolio.subdomain

    try:
        portfolio.subdomain = payload.subdomain
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That subdomain is already taken")  # noqa: B904, E501

    if portfolio.is_published:
        try:
            await kv_service.put_artifact(payload.subdomain, portfolio.artifact)
            await kv_service.delete_artifact(old_subdomain)
        except Exception as e:
            portfolio.last_deploy_error = str(e)
            await db.commit()
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Subdomain updated, KV migration failed")  # noqa: B904, E501
    await db.commit()
    await db.refresh(portfolio)
    return SubdomainRead(subdomain=portfolio.subdomain)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Delete the portfolio. Auto-undeploys from KV if currently live."""
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No portfolio yet")

    if portfolio.is_published:
        try:
            await kv_service.delete_artifact(portfolio.subdomain)
        except Exception:
            pass  # best-effort; delete the DB row regardless

    await db.delete(portfolio)
    await db.commit()

@router.patch("/me/template", response_model=StyleUpdateResult)
async def change_template(
    payload: TemplateUpdate,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Change the template. Re-pushes to KV if the portfolio is live."""
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No portfolio yet")

    portfolio.template_id = payload.template_id

    if portfolio.is_published:
        try:
            await kv_service.put_artifact(
                portfolio.subdomain,
                portfolio.artifact,
                template_id=portfolio.template_id,
                scheme_id=portfolio.scheme_id,
            )
        except Exception as e:
            portfolio.last_deploy_error = str(e)
            await db.commit()
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Template updated but redeploy failed")  # noqa: B904, E501
    await db.commit()
    return StyleUpdateResult(
        template_id=portfolio.template_id,
        scheme_id=portfolio.scheme_id,
        is_published=portfolio.is_published,
        last_deploy_error=portfolio.last_deploy_error,
    )

@router.patch("/me/scheme", response_model=StyleUpdateResult)
async def change_scheme(
    payload: SchemeUpdate,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Change the color/font scheme. Re-pushes to KV if the portfolio is live."""
    portfolio = await portfolio_service.get_portfolio_by_user(db, user.id)
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No portfolio yet")

    portfolio.scheme_id = payload.scheme_id

    if portfolio.is_published:
        try:
            await kv_service.put_artifact(
                portfolio.subdomain,
                portfolio.artifact,
                template_id=portfolio.template_id,
                scheme_id=portfolio.scheme_id,
            )
        except Exception as e:
            portfolio.last_deploy_error = str(e)
            await db.commit()
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Scheme updated but redeploy failed")  # noqa: B904, E501
    await db.commit()
    return StyleUpdateResult(
        template_id=portfolio.template_id,
        scheme_id=portfolio.scheme_id,
        is_published=portfolio.is_published,
        last_deploy_error=portfolio.last_deploy_error,
    )
