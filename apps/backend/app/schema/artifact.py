"""The portfolio artifact: the single source of truth for one user's site.

Everything that produces a portfolio (V1 templates, V2 AI extraction) emits
this shape, and everything that renders one (the SVG card renderer, the HTML
page renderer) consumes this shape. It is the contract between the two sides,
so producers and renderers never need to know about each other.

Split in two on purpose:
  - design  : how it looks. Pure values (colors, fonts, spacing). No markup.
  - content : what it says. Structured data. No styling.
They change for different reasons and come from different producers, so they
stay independent halves. A template swap touches only design; a text edit
touches only content.
"""

from pydantic import BaseModel, Field, HttpUrl

# ─── design: pure visual tokens ───────────────────────────────
# Format-agnostic values only. The SVG renderer turns colors.primary into
# fill="...", the HTML renderer turns it into background:.... Storing any
# markup here would lock a token to a single renderer, so we never do.


class Colors(BaseModel):
    background: str
    surface: str
    primary: str
    accent: str
    text_primary: str
    text_muted: str
    border: str


class Font(BaseModel):
    # Family only. Weights are set per-element in Weights below, because one
    # family is used at several weights across the page.
    family: str


class Fonts(BaseModel):
    heading: Font
    body: Font
    mono: Font  # code blocks, terminal-style templates


class Weights(BaseModel):
    # Explicit weight per rendered element. The renderer maps each element to
    # its token; the design half decides the actual numeric weight.
    # Note: these element names assume the V1 fixed structure. If V2 changes
    # the section/heading structure, this block changes with it.
    h1: int = 700
    h2: int = 600
    h3: int = 600
    body: int = 400
    bold_body: int = 600
    label: int = 600
    caption: int = 400
    mono: int = 400


class Typography(BaseModel):
    base_size: int = 16  # body text size in px
    # Each heading step multiplies by this; renderer derives h1..h3 from it.
    scale_ratio: float = 1.25
    weights: Weights = Field(default_factory=Weights)


class Scale(BaseModel):
    # Base spacing unit in px; multiples of this drive all gaps/margins.
    spacing_unit: int = 8
    radius: int = 8
    card_padding: int = 24


class Design(BaseModel):
    colors: Colors
    fonts: Fonts
    typography: Typography = Field(default_factory=Typography)
    scale: Scale = Field(default_factory=Scale)
    # In V1 this is constant ("default") — one structure, many skins. V2 will
    # branch the renderer on this to introduce different structural layouts.
    layout: str = "default"


# ─── content: structured data, no styling ─────────────────────
# These sections map 1:1 onto both the README cards and the HTML page
# sections: heading, about, projects, stack, experience, contact, footer.


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
    # Free-form grouping label, e.g. "language", "framework", "tool".
    category: str = ""


class ExperienceItem(BaseModel):
    role: str
    organisation: str = ""
    # Free-form so users can write "2023 – Present" without date parsing.
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
    # Footer is mostly boilerplate; keep it as plain text the user can set.
    footer: str = ""


# ─── the artifact itself ──────────────────────────────────────


class Artifact(BaseModel):
    # Bumped when the shape changes. Stored alongside the artifact so we can
    # find and migrate old versions without cracking open the JSONB.
    schema_version: int = 1
    design: Design
    content: Content
