from redis.asyncio import Redis

from app.core.config import settings

_STATE_PREFIX = "oauth_state:"
_REFRESH_PREFIX = "refresh_jti:"

_STATE_TTL_SECONDS = 300

async def store_state(redis:Redis,state:str)->None:
    await redis.setex(f"{_STATE_PREFIX}{state}",_STATE_TTL_SECONDS,"1")

async def consume_state(redis:Redis,state:str)->bool:
    key = f"{_STATE_PREFIX}{state}"
    # DELETE returns the number of keys removed: 1 if it existed, 0 if not.
    deleted = await redis.delete(key)
    return deleted == 1

async def store_refresh_jti(redis: Redis, user_id: int, jti: str) -> None:
    """Mark a refresh token's jti as valid, expiring when the token does."""
    ttl = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    await redis.setex(f"{_REFRESH_PREFIX}{jti}", ttl, str(user_id))
 
 
async def is_refresh_jti_valid(redis: Redis, jti: str) -> bool:
    """True if this refresh jti is still in the allowlist (not revoked/expired)."""
    return await redis.exists(f"{_REFRESH_PREFIX}{jti}") == 1
 
 
async def revoke_refresh_jti(redis: Redis, jti: str) -> None:
    """Remove a refresh jti so it can no longer be used (logout)."""
    await redis.delete(f"{_REFRESH_PREFIX}{jti}")