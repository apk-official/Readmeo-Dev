from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser
from app.db.session import get_db
from app.schema.artifact import Content
from app.services.github_profile import fetch_github_content

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/import")
async def get_github_user_data(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Content:
    """Fetch the user's GitHub profile and repos, shaped as portfolio content.

    The frontend calls this to pre-fill the portfolio form. The user can then
    edit the result before submitting PUT /portfolios/me.
    """
    try:
        content = await fetch_github_content(user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,detail=str(e)) from e
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail="Failed to fetch Github Profile") from e
    return content
