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
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator(
    should_group_status_codes=True,
    excluded_handlers=["/metrics", "/health", "/health/dependencies"],
).instrument(app).expose(app)

app.include_router(health.router)
app.include_router(auth.router)
