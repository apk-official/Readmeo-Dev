"""Shared async Redis client.

One client for the app, reused across requests (redis-py handles its own
connection pool internally, so a single client is the right shape). Used for
OAuth state and the refresh-token allowlist; see token_store.py.
"""
from collections.abc import AsyncGenerator

import redis.asyncio as redis

from app.core.config import settings

redis_client: redis.Redis = redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


async def get_redis() -> AsyncGenerator[redis.Redis, None]:
    # Dependency that just hands back the shared client. It's a generator to
    # match get_db's shape, so routes inject Redis the same way they inject
    # the DB session.
    yield redis_client
