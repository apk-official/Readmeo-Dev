"""Async database engine and session factory.

One engine for the whole app, with a per-request session handed out by the
get_db dependency. The session is scoped to a single request: opened when the
request starts, rolled back on error, always closed at the end.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.DEBUG,
    pool_pre_ping=True, #check a connection is alive before using it, drop stale ones
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    #Keep attributes accessible after commit. Without this, touching a model
    # field post-commit triggers a fresh DB load (and fails outside a session).
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    # FastAPI dependency. Yields one session per request; the try/finally
    # guarantees a rollback on any error and a close no matter what.
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
