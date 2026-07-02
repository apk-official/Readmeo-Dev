"""The portfolio artifact: the content of one user's site.

Styling is not stored here. It lives in the portfolio's template_id and
scheme_id, which point at templates (HTML structure) and schemes (colors +
fonts) defined in the Worker. So the artifact is purely what the site says,
never how it looks.
"""

from typing import Literal

from pydantic import BaseModel, Field, HttpUrl, model_validator


class Identity(BaseModel):
    name: str
    tagline: str = ""
    avatar_url: HttpUrl | None = None


class Project(BaseModel):
    title: str
    description: str = ""
    repo_url: HttpUrl | None = None
    live_url: HttpUrl | None = None
    # Which link the README card redirects to. The portfolio shows both.
    primary_link: Literal["repo", "live"] = "repo"
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
    # platform is free-form: "github", "kofi", "blog", anything.
    platform: str
    url: HttpUrl


class Contact(BaseModel):
    # An explicit contact method the user chooses to surface: email, phone,
    # or any link. `kind` decides how `value` is validated and formatted:
    #   email -> mailto:addr   phone -> tel:number   link -> https URL
    label: str
    value: str
    kind: Literal["email", "phone", "link"] = "link"

    @model_validator(mode="after")
    def normalize_value(self):
        v = self.value.strip()
        if self.kind == "email":
            addr = v.removeprefix("mailto:")
            if "@" not in addr or "." not in addr.split("@")[-1]:
                raise ValueError("invalid email address")
            self.value = f"mailto:{addr}"
        elif self.kind == "phone":
            self.value = v if v.startswith("tel:") else f"tel:{v}"
        else:
            if not v.startswith(("http://", "https://", "mailto:", "tel:")):
                v = f"https://{v}"
            if not v.startswith(("http://", "https://")):
                raise ValueError("links must be http(s)")
            self.value = v
        return self


class SectionTitles(BaseModel):
    # Display labels for the fixed V1 sections. Users can rename them
    # ("About" -> "Who am I") without changing the structure.
    about: str = "About"
    projects: str = "Projects"
    stack: str = "Stack"
    experience: str = "Experience"
    contact: str = "Contact"


class Content(BaseModel):
    identity: Identity
    about: str = ""
    projects: list[Project] = Field(default_factory=list)
    stack: list[StackItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    socials: list[Social] = Field(default_factory=list)
    contacts: list[Contact] = Field(default_factory=list)
    footer: str = ""
    section_titles: SectionTitles = Field(default_factory=SectionTitles)


class Artifact(BaseModel):
    schema_version: int = 1
    content: Content
