"""Cloudflare KV operations — push and delete a portfolio artifact.

Uses the Cloudflare REST API to write/delete keys in the KV namespace.
The key is the subdomain; the value is the artifact JSON.
The Worker reads this key to render the portfolio page.
"""

import json

import httpx

from app.core.config import settings


def _kv_url(key: str) -> str:
    return (
        f"https://api.cloudflare.com/client/v4/accounts/{settings.CF_ACCOUNT_ID}"
        f"/storage/kv/namespaces/{settings.CF_KV_NAMESPACE_ID}/values/{key}"
    )


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.CF_API_TOKEN}",
        "Content-Type": "application/json",
    }


async def put_artifact(subdomain: str, artifact_dict: dict) -> None:
    """Write the artifact JSON to KV under the subdomain key."""
    async with httpx.AsyncClient() as client:
        res = await client.put(
            _kv_url(subdomain),
            headers=_headers(),
            content=json.dumps(artifact_dict),
        )
        res.raise_for_status()


async def delete_artifact(subdomain: str) -> None:
    """Remove the artifact from KV, taking the portfolio offline."""
    async with httpx.AsyncClient() as client:
        res = await client.delete(_kv_url(subdomain), headers=_headers())
        # 404 means it was already gone — that's fine.
        if res.status_code != 404:
            res.raise_for_status()