"""Shared pytest fixtures for the GitBunny backend test suite.

CI runs unit-only (no real Postgres/Redis), so these fixtures hand your code
mocked versions of the async DB session and Redis client. When you later add an
integration job with real service containers, you can add a separate fixture
(e.g. `db_session`) that yields a real AsyncSession instead of this mock.
"""

from unittest.mock import AsyncMock, MagicMock

import pytest


@pytest.fixture
def mock_db():
    """A stand-in for an async SQLAlchemy AsyncSession.

    `execute`, `get`, `commit`, `flush`, `refresh`, `rollback`, `close` are all
    awaitable mocks. In a test you set return values, e.g.:

        result = MagicMock()
        result.scalar_one_or_none.return_value = None
        mock_db.execute.return_value = result
    """
    session = MagicMock()
    session.execute = AsyncMock()
    session.get = AsyncMock()
    session.commit = AsyncMock()
    session.flush = AsyncMock()
    session.refresh = AsyncMock()
    session.rollback = AsyncMock()
    session.close = AsyncMock()
    session.add = MagicMock()
    return session


@pytest.fixture
def mock_redis():
    """A stand-in for an async redis client.

    Methods used by token_store (setex, delete, exists, ping) are awaitable.
    Configure per test, e.g. `mock_redis.delete.return_value = 1`.
    """
    redis = MagicMock()
    redis.setex = AsyncMock()
    redis.delete = AsyncMock()
    redis.exists = AsyncMock()
    redis.ping = AsyncMock()
    return redis
