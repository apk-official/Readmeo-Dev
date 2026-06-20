"""Starter unit tests.

These are pure unit tests — no DB, no Redis, no network. They exercise the
token-store logic against the `mock_redis` fixture from conftest.py.

NOTE: the first time you wire up real tests against app.core.security and
app.core.crypto, expect two existing bugs to surface:
  - crypto.decrypt calls base64.bs64decode (typo for b64decode)
  - security.decode_token passes algorithm= to jwt.decode (should be algorithms=)
Those are real bugs in the current tree; the tests are correct to fail on them.
"""

import pytest

from app.services import token_store


@pytest.mark.asyncio
async def test_consume_state_returns_true_when_key_existed(mock_redis):
    mock_redis.delete.return_value = 1
    assert await token_store.consume_state(mock_redis, "abc") is True


@pytest.mark.asyncio
async def test_consume_state_returns_false_when_key_missing(mock_redis):
    mock_redis.delete.return_value = 0
    assert await token_store.consume_state(mock_redis, "abc") is False


@pytest.mark.asyncio
async def test_refresh_jti_valid_checks_existence(mock_redis):
    mock_redis.exists.return_value = 1
    assert await token_store.is_refresh_jti_valid(mock_redis, "jti123") is True
    mock_redis.exists.return_value = 0
    assert await token_store.is_refresh_jti_valid(mock_redis, "jti123") is False
