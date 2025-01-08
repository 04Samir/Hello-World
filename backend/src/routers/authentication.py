"""
The API Routes for the Authentication System
"""

from fastapi import APIRouter, Body, Depends, Request
from fastapi.exceptions import HTTPException

from ..db import get_db, DataBase, User, UserPreference
from ..middleware import (
    resolve_user_info,
    SessionManager
)
from ..utils import (
    standard_response,
    validate_request,
    Hasher,
    JSONResponse
)


router = APIRouter()


@router.post("/sign-up")
async def signup_user(request: Request, payload: dict = Body(...), db: DataBase = Depends(get_db)) -> JSONResponse:
    body = validate_request(payload, {
        'username': str,
        'password': str,
    })
    
    check = await User.GetByName(db, username=body['username'])
    if check:
        raise HTTPException(400, "Username Already Exists")
    
    user_info = await resolve_user_info(request)

    user = await User.Create(
        db,
        display_name=body['username'],
        username=body['username'],
        password=Hasher.hash_password(body['password']),
        country=user_info['country']
    )
    token = await SessionManager.Create(
        db, user.id,
        location=user_info['location'],
        device=user_info['device']
    )

    await UserPreference.Create(db, user.id)

    return standard_response(
        status_code=201,
        extra={
            'user': user.as_dict(ignore=['password']),
            'token': token
        }
    )


@router.post("/log-in")
async def login_user(request: Request, payload: dict = Body(...), db: DataBase = Depends(get_db)) -> JSONResponse:
    body = validate_request(payload, {
        'username': str,
        'password': str,
    })

    user = await User.GetByName(db, username=body['username'])
    if not user:
        raise HTTPException(401, "Invalid Credentials")
    
    if not Hasher.verify_password(user.password, body['password']):
        raise HTTPException(401, "Invalid Credentials")
    
    user_info = await resolve_user_info(request, find_country=False)
    
    token = await SessionManager.Create(
        db, user.id,
        location=user_info['location'],
        device=user_info['device']
    )

    return standard_response(
        status_code=200,
        extra={
            'user': user.as_dict(ignore=['password']),
            'token': token
        }
    )


@router.post("/log-out")
async def logout_user(payload: dict = Body(...), db: DataBase = Depends(get_db)) -> JSONResponse:
    body = validate_request(payload, {
        'token': str
    })
    
    await SessionManager.Delete(db, token=body['token'])

    return standard_response(
        status_code=200,
        extra={
            'message': 'Successfully Logged Out!'
        }
    )
