"""Request and response schemas for the portfolio API.

The Artifact is the design+content contract; these wrap it for the wire.
PortfolioCreate is what the form submits; PortfolioRead is what we return.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schema.artifact import Artifact


class PortfolioCreate(BaseModel):
    # What the form sends: a chosen subdomain + template, plus the built artifact.
    subdomain: str
    template_id: str
    schema_id:str
    artifact: Artifact


class PortfolioRead(BaseModel):
    # from_attributes lets us return the ORM object directly; the stored
    # artifact dict is re-validated back into an Artifact on the way out.
    model_config = ConfigDict(from_attributes=True)

    id: int
    subdomain: str
    template_id: str
    schema_version: int
    artifact: Artifact
    is_published: bool
    last_deployed_at: datetime | None
    created_at: datetime
    updated_at: datetime



class SubdomainUpdate(BaseModel):
    subdomain: str

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
