from typing import Annotated

import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.redis import get_redis
from app.db.session import get_db

router = APIRouter(tags=["health"])

DbDep = Annotated[AsyncSession, Depends(get_db)]
RedisDep = Annotated[Redis, Depends(get_redis)]


@router.get("/health")
async def health(db: DbDep, redis: RedisDep) -> JSONResponse:
    """Critical-infrastructure health. Returns 503 if DB or Redis is down.

    This is what load balancers and uptime monitors consume — it reflects
    only things we own and must have working to serve requests.
    """
    components: dict[str, str] = {}

    try:
        await db.execute(text("SELECT 1"))
        components["database"] = "ok"
    except Exception:
        components["database"] = "down"

    try:
        await redis.ping()
        components["redis"] = "ok"
    except Exception:
        components["redis"] = "down"

    healthy = all(v == "ok" for v in components.values())
    return JSONResponse(
        status_code=200 if healthy else 503,
        content={"status": "ok" if healthy else "degraded", "components": components},
    )


@router.get("/health/dependencies")
async def dependency_health() -> dict:
    """Informational status of external services (GitHub).

    Deliberately ALWAYS returns 200 — a GitHub outage is not OUR server
    being unhealthy, so this must never affect load-balancer routing.
    Use it to answer "is GitHub the reason logins are failing right now?"
    """
    components: dict[str, str] = {}

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get("https://api.github.com/zen")
        components["github"] = "ok" if resp.status_code == 200 else "degraded"
    except Exception:
        components["github"] = "down"

    return {"components": components}
