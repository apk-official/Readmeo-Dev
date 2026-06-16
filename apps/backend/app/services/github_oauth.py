import secrets
from urllib.parse import urlencode

import httpx

from app.core.config import settings

GITHUB_AUTHORIZE_URL="https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"

DEFAULT_SCOPE = "read:user"

class GitHubOAuthError(Exception):
    """Raised when any step of the Github OAuth exchange fails."""

def generate_state()->str:
    return secrets.token_urlsafe(32)

def build_authorize_url(state:str,*,write:bool=False)->str:
    params ={
        "client_id":settings.GITHUB_CLIENT_ID,
        "redirect_uri":(
            settings.GITHUB_CALLBACK_URL_WRITE if write else settings.GITHUB_CALLBACK_URL
        ),
        "scope":"read:user public_repo" if write else  DEFAULT_SCOPE,
        "state":state,
        "allow_signup":"true",
    }

    return f"{GITHUB_AUTHORIZE_URL}?{urlencode(params)}"

async def exchange_code_for_token(code:str,*,write:bool=False)->dict[str,str]:

    redirect_uri = (
        settings.GITHUB_CALLBACK_URL_WRITE if write else settings.GITHUB_CALLBACK_URL
    )
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            GITHUB_TOKEN_URL,
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": redirect_uri,
            },
            headers={"Accept":"application/json"},
        )
    if resp.status_code !=200:
        raise GitHubOAuthError(f"Token exchange failed:HTTP {resp.status_code}")
    
    data = resp.json()

    if "error" in data:
        raise GitHubOAuthError(
            data.get("error_description", data["error"])
        )
    
    access_token = data.get("access_token")
    if not access_token:
        raise GitHubOAuthError("No access_token in GitHub response")
 
    return {"access_token": access_token, "scope": data.get("scope", "")}

async def fetch_github_user(access_token: str) -> dict:
    """Fetch the authenticated user's profile from the GitHub API."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(
            GITHUB_USER_URL,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        )
 
    if resp.status_code != 200:
        raise GitHubOAuthError(f"Failed to fetch GitHub user: HTTP {resp.status_code}")
 
    return resp.json()