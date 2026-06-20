from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    github_id: int
    github_username: str
    email: str | None
    avatar_url: str | None
    is_active: bool
    created_at: datetime
