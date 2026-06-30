"""Fetch a user's GitHub profile and repos to pre-fill the portfolio form.

Uses the encrypted GitHub token stored at login. Returns data shaped to the
Content model so the frontend can drop it straight into the form.
"""

import httpx

from app.core.crypto import decrypt
from app.models.user import User
from app.schema.artifact import Content, Identity, Project, Social


async def fetch_github_content(user: User) -> Content:
    if not user.encrypted_github_token:
        raise ValueError("No GitHub token stored for this user")

    token = decrypt(user.encrypted_github_token)
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }

    async with httpx.AsyncClient() as client:
        profile_res = await client.get("https://api.github.com/user", headers=headers)
        profile_res.raise_for_status()

        repos_res = await client.get(
            "https://api.github.com/user/repos",
            headers=headers,
            params={"sort": "pushed", "per_page": 20, "type": "owner"},
        )
        repos_res.raise_for_status()

    gh = profile_res.json()
    repos = repos_res.json()

    identity = Identity(
        name=gh.get("name") or gh.get("login", ""),
        tagline=gh.get("bio") or "",
        avatar_url=gh.get("avatar_url"),
    )

    # Skip forks and archived repos; take top 6 by last push.
    projects = [
        Project(
            title=repo["name"],
            description=repo.get("description") or "",
            repo_url=repo["html_url"],
            # GitHub's "homepage" field is the live site, if the user set one.
            live_url=repo.get("homepage") or None,
            primary_link="repo",
            tags=repo.get("topics") or [],
        )
        for repo in repos
        if not repo["fork"] and not repo.get("archived")
    ][:6]

    socials = [
        Social(platform="github", url=f"https://github.com/{gh['login']}"),
    ]

    blog = gh.get("blog") or ""
    if blog:
        if not blog.startswith(("http://", "https://")):
            blog = f"https://{blog}"
    socials.append(Social(platform="website", url=blog))

    if gh.get("twitter_username"):
        socials.append(Social(
            platform="twitter",
            url=f"https://twitter.com/{gh['twitter_username']}",
        ))

    return Content(
        identity=identity,
        about=gh.get("bio") or "",
        projects=projects,
        socials=socials,
    )
