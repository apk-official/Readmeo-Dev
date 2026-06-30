"""Generate the README markdown a user pastes into their GitHub profile.

The markdown embeds the live card images (served by the Worker) and wraps
each in a link. Because it points at live URLs, the README stays current
with whatever the user has deployed — no regeneration needed on edits.
"""

from html import escape

from app.core.config import settings
from app.models.portfolio import Portfolio


def _base_url(subdomain: str) -> str:
    return f"https://{subdomain}.{settings.CF_BASE_DOMAIN}"


def generate_readme(portfolio: Portfolio, github_username: str) -> str:
    base = _base_url(portfolio.subdomain)
    content = portfolio.artifact["content"]
    projects = content.get("projects", [])

    lines = []

    # Hero card -> links to the portfolio site.
    name = escape(content["identity"]["name"], quote=True)
    lines.append(f'<a href="{base}">')
    lines.append(f'  <img src="{base}/readme/hero" width="100%" alt="{name}" />')
    lines.append("</a>")
    lines.append("")

    # Project cards -> each links to its chosen url (repo or live), two per row.
    if projects:
        lines.append("<p>")
        for i, p in enumerate(projects):
            primary = p.get("primary_link", "repo")
            url = p.get("repo_url") if primary == "repo" else p.get("live_url")
            # Fall back to whichever link exists, then to the profile.
            url = url or p.get("repo_url") or p.get("live_url") or f"https://github.com/{github_username}"
            url = escape(str(url), quote=True)
            title = escape(p.get("title", "Project"), quote=True)
            lines.append(f'  <a href="{url}">')
            lines.append(f'    <img src="{base}/readme/project/{i}" width="49%" alt="{title}" />')
            lines.append("  </a>")
        lines.append("</p>")
        lines.append("")

    # Contact card -> links to the GitHub profile.
    gh_url = escape(f"https://github.com/{github_username}", quote=True)
    lines.append(f'<a href="{gh_url}">')
    lines.append(f'  <img src="{base}/readme/contact" width="100%" alt="Stack and contact" />')
    lines.append("</a>")
    lines.append("")

    # Quiet attribution.
    lines.append("<sub>Built with <a href=\"https://gitbunny.dev\">GitBunny</a></sub>")

    return "\n".join(lines)
