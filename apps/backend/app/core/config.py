"""Application settings, loaded once from the environment.
Everything configurable lives here as a single Settings object. The active
.env file is chosen by the ENV variable (.env.dev locally, .env.test under
pytest, platform-injected vars in prod), so the same code reads the right
values everywhere without us touching it.
"""

import os
from functools import lru_cache

from pydantic import computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV = os.getenv("ENV", "dev")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=f".env.{ENV}",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # -------- Server ----------
    DEBUG: bool = False
    FRONTEND_URL: str

    # -------- JWT ----------

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # -------- PostgreSQL ----------

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str

    @computed_field  # type:ignore[prop-decorator]
    @property
    def DATABASE_URL(self) -> str:
        # Assemble the async connection string from the parts above so we
        # never hand-write (and never typo) the DSN. asyncpg driver because
        # the whole stack is async.
        return str(
            MultiHostUrl.build(
                scheme="postgresql+asyncpg",
                username=self.POSTGRES_USER,
                password=self.POSTGRES_PASSWORD,
                host=self.POSTGRES_SERVER,
                port=self.POSTGRES_PORT,
                path=self.POSTGRES_DB,
            )
        )

    # -------- Redis----------
    # DB 0 for app state (OAuth state, refresh allowlist), 1 and 2 reserved
    # for Celery so the queues never collide with our keys.

    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # -------- Github OAuth----------

    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_CALLBACK_URL: str
    # Second callback for when a user upgrades to write scope (auto-deploy).
    # Kept separate so the read-only and write flows can't be confused.
    GITHUB_CALLBACK_URL_WRITE: str

    # -------- ANTHROPIC----------

    ANTHROPIC_API_KEY: str

    # -------- Cloudflare----------

    CF_API_TOKEN: str
    CF_ACCOUNT_ID: str
    CF_ZONE_ID: str
    CF_BASE_DOMAIN: str
    CF_KV_NAMESPACE_ID: str

    # -------- Encryption ----------

    ENCRYPTION_KEY: str


@lru_cache
def get_settings() -> Settings:
    # lru_cache makes this a singleton: Settings is built once, on first call,
    # then handed back from cache. Avoids re-reading the .env file on every
    # import and gives every module the same instance.
    return Settings()


settings = get_settings()
