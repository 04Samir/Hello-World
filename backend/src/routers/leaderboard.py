"""
The API Routes for the Leaderboard Page
"""

from fastapi import APIRouter, Depends

from ..db import get_db, DataBase, User
from ..utils import standard_response, JSONResponse


router = APIRouter()


@router.get("/leaderboard")
async def get_leaderboard(db: DataBase = Depends(get_db)) -> JSONResponse:
    users = await User.GetAll(db, limit=10, sort_by="points", order="desc") 
    return standard_response(
        status_code=200, 
        extra={'leaderboard': [user.as_dict(ignore=['password']) for user in users]}
    )
