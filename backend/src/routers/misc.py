"""
The API Routes for the Miscellaneous Endpoints
"""

from fastapi import APIRouter, Body, Depends
from fastapi.exceptions import HTTPException

import json
from pathlib import Path

from ..utils import standard_response, JSONResponse


router = APIRouter()

@router.get("/country-codes")
async def get_countries() -> JSONResponse:
    with open(str(Path(__file__).parents[1]) + "/" + "utils" + "/" + "countries.json", "r") as File:
        COUNTRIES = json.load(File)

    return standard_response(
        status_code=200,
        extra={
            'countries': COUNTRIES
        }
    )
