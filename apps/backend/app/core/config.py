from functools import lru_cache

from pydantic import PostgresDsn, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding = "utf-8",
        case_sensitive = True,
        extra="ignore",
    )

    # -------- Server ----------
    DEBUG:bool=False
    FRONTEND_URL:str

    # -------- JWT ----------

    SECRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int = 15
    REFRESH_TOKEN_EXPIRE_DAYS:int = 7

    # -------- PostgreSQL ----------

    POSTGRES_USER:str
    POSTGRES_PASSWORD:str
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT:int = 5432
    POSTGRES_DB:str

    @computed_field #type:ignore[prop-decorator]
    @property
    def DATABASE_URL(self)->PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+asyncpg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    # -------- Redis----------

    REDIS_URL:str = "redis://localhost:6379/0"
    CELERY_BROKER_URL:str="redis://localhost:6379/1"
    CELERY_RESULT_BACKEND:str="redis://localhost:6379/2"

    # -------- Github OAuth----------

    GITHUB_CLIENT_ID:str
    GITHUB_CLIENT_SECRET:str
    GITHUB_CLIENT_URL:str
    GITHUB_CLIENT_URL_WRITE:str

    # -------- ANTHROPIC----------

    ANTHROPIC_API_KEY:str

    # -------- Cloudflare----------

    CF_API_TOKEN:str
    CF_ACCOUNT_ID:str
    CF_ZONE_ID:str
    CF_BASE_DOMAIN:str

    # -------- Encryption ----------

    ENCRYPTION_KEY:str

@lru_cache
def get_settings()->Settings:
    return Settings()

settings = get_settings()