"""Cloudflare KV operations — push and delete a portfolio artifact.

Uses the Cloudflare REST API to write/delete keys in the KV namespace.
The key is the subdomain; the value is the artifact JSON.
The Worker reads this key to render the portfolio page.
"""

import json
from urllib.parse import quote

import httpx

from app.core.config import settings


def _kv_url(key: str) -> str:
    # quote the key so it can't break out of the values/<key> path segment.
    safe_key = quote(key, safe="")
    return (
        f"https://api.cloudflare.com/client/v4/accounts/{settings.CF_ACCOUNT_ID}"
        f"/storage/kv/namespaces/{settings.CF_KV_NAMESPACE_ID}/values/{safe_key}"
    )


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.CF_API_TOKEN}",
        "Content-Type": "application/json",
    }


async def put_artifact(
    subdomain: str,
    artifact_dict: dict,
    *,
    template_id: str,
    scheme_id: str,
    accent: str | None = None,
) -> None:
    """Write the artifact (plus template/scheme choice) to KV under the subdomain."""
    payload = {**artifact_dict, "template_id": template_id, "scheme_id": scheme_id,"accent": accent}
    async with httpx.AsyncClient() as client:
        res = await client.put(
            _kv_url(subdomain),
            headers=_headers(),
            content=json.dumps(payload),
        )
        res.raise_for_status()


async def delete_artifact(subdomain: str) -> None:
    """Remove the artifact from KV, taking the portfolio offline."""
    async with httpx.AsyncClient() as client:
        res = await client.delete(_kv_url(subdomain), headers=_headers())
        # 404 means it was already gone — that's fine.
        if res.status_code != 404:
            res.raise_for_status()
