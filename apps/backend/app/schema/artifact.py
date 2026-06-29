"""The portfolio artifact: the content of one user's site.

Styling is not stored here. It lives in the portfolio's template_id and
scheme_id, which point at templates (HTML structure) and schemes (colors +
fonts) defined in the Worker. So the artifact is purely what the site says,
never how it looks.
"""

from pydantic import BaseModel, Field, HttpUrl

# ─── content sections ─────────────────────────────────────────
# These map onto both the README cards and the HTML page sections:
# heading, about, projects, stack, experience, contact, footer.


class Identity(BaseModel):
    name: str
    tagline: str = ""
    avatar_url: HttpUrl | None = None


class Project(BaseModel):
    title: str
    description: str = ""
    url: HttpUrl | None = None
    tags: list[str] = Field(default_factory=list)


class StackItem(BaseModel):
    name: str
    category: str = ""


class ExperienceItem(BaseModel):
    role: str
    organisation: str = ""
    period: str = ""
    description: str = ""


class Social(BaseModel):
    platform: str
    url: HttpUrl


class Content(BaseModel):
    identity: Identity
    about: str = ""
    projects: list[Project] = Field(default_factory=list)
    stack: list[StackItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    socials: list[Social] = Field(default_factory=list)
    footer: str = ""


# ─── the artifact itself ──────────────────────────────────────


class Artifact(BaseModel):
    schema_version: int = 1
    content: Content