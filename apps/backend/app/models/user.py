from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id:Mapped[int]=mapped_column(primary_key=True)
    github_id:Mapped[int] = mapped_column(unique=True,index=True)
    github_username:Mapped[str] = mapped_column(String(39),index=True)
    email:Mapped[str|None]=mapped_column(String(320),index=True)
    avatar_url:Mapped[str|None]=mapped_column(String(512))

    encrypted_github_token:Mapped[str|None]=mapped_column(String)
    token_scopes:Mapped[str|None]=mapped_column(String)

    is_active:Mapped[bool]=mapped_column(Boolean,default=True)

    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())

    updated_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    def __rep__(self)->str:
        return f"<User id={self.id} github_username={self.github_username!r}>"