"""Request and response schemas for the portfolio API.

The Artifact is the design+content contract; these wrap it for the wire.
PortfolioCreate is what the form submits; PortfolioRead is what we return.
"""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.schema.artifact import Artifact

# DNS label rules: lowercase alphanumeric and hyphens, no leading/trailing
# hyphen, 1-63 chars. Constrained here so an unvalidated subdomain can never
# reach the KV key path or the rendered README.
Subdomain = Annotated[
    str,
    StringConstraints(
        pattern=r"^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$",
        to_lower=True,
    ),
]


class PortfolioCreate(BaseModel):
    # What the form sends: a chosen subdomain + template, plus the built artifact.
    subdomain: Subdomain
    template_id: str
    scheme_id: str
    artifact: Artifact


class PortfolioRead(BaseModel):
    # from_attributes lets us return the ORM object directly; the stored
    # artifact dict is re-validated back into an Artifact on the way out.
    model_config = ConfigDict(from_attributes=True)

    id: int
    subdomain: str
    template_id: str
    scheme_id: str
    schema_version: int
    artifact: Artifact
    is_published: bool
    last_deployed_at: datetime | None
    created_at: datetime
    updated_at: datetime


class SubdomainUpdate(BaseModel):
    subdomain: Subdomain

class DeployStatus(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    is_published: bool
    last_deployed_at: datetime | None
    last_deploy_error: str | None

class SubdomainRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    subdomain: str

class TemplateUpdate(BaseModel):
    template_id: str

class SchemeUpdate(BaseModel):
    scheme_id: str
class StyleUpdateResult(BaseModel):
    template_id: str
    scheme_id: str
    is_published: bool
    last_deploy_error: str | None

class AccentUpdate(BaseModel):
    accent: str
