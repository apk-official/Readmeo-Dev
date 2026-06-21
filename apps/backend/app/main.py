"""FastAPI application entry point.

Builds the app: lifespan hooks for startup/shutdown, CORS for the frontend,
Prometheus instrumentation, and the route registration. This is what uvicorn
imports and serves.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.routes import auth, health
from app.core.config import settings
from app.db.redis import redis_client
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ping Redis on startup so we fail fast if it's unreachable, rather than
    # discovering it on the first request. Clean up the Redis and DB
    # connections on shutdown.
    await redis_client.ping()
    yield
    await redis_client.aclose()
    await engine.dispose()


app = FastAPI(
    title="GitBunny API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
     # Only the frontend origin, not "*", because we send credentials (cookies)
     # and the two are incompatible.
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Expose /metrics for Prometheus. Exclude the health and metrics endpoints from
# the request metrics themselves so monitors and scrapers don't skew the data.
Instrumentator(
    should_group_status_codes=True,
    excluded_handlers=["/metrics", "/health", "/health/dependencies"],
).instrument(app).expose(app)

# Health routes stay unversioned; the auth router carries its own /auth prefix.
app.include_router(health.router)
app.include_router(auth.router)
