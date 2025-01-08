"""
The Responses for the Application
"""

from fastapi.exceptions import HTTPException
from fastapi.responses import ORJSONResponse as JSONResponse

from typing import Any, Dict, Optional


DEFAULT_ERROR_MESSAGES = {
    400: {
        'short': 'Bad Request',
        'long': 'Your Request was Invalid'
    },
    401: {
        'short': 'Un-Authorised',
        'long': 'You are Not Authorised to View this Resource'
    },
    403: {
        'short': 'Forbidden',
        'long': 'You are Forbidden from Viewing this Resource'
    },
    404: {
        'short': 'Not Found',
        'long': 'The Resource you Requested was Not Found'
    },
    405: {
        'short': 'Method Not Allowed',
        'long': 'The Method you Requested is Not Allowed'
    },
    500: {
        'short': 'Internal Server Error',
        'long': 'An Internal Server Error has Occured'
    }
}


def standard_response(*, status_code: int, extra: Optional[dict[str, Any]] = None) -> JSONResponse:
    """
    The Standard Response for the Application

    Parameters
    ----------
    status_code: :class:`int`
        The Status Code for the Response
    extra: Optional[:class:`dict`[:class:`str`, :class:`Any`]]
        The Extra Data to Include in the Response

    Returns
    -------
    :class:`JSONResponse`
        The JSON Response
    """

    content = {
        'code': status_code,
    }
    if extra:
        content.update(extra)
   
    return JSONResponse(
        status_code=status_code,
        content=content
    )


def exception_response(*, status_code: int, message: Optional[str] = None) -> JSONResponse:
    """
    The Exception Response for the Application

    Parameters
    ----------
    status_code: :class:`int`
        The Status Code for the Response
    message: Optional[:class:`str`]
        The Message for the Response

    Returns
    -------
    :class:`JSONResponse`
        The JSON Response
    """

    return standard_response(
        status_code=status_code,
        extra={
            'error': {
                'status': DEFAULT_ERROR_MESSAGES[status_code]['short'],
                'message': message or DEFAULT_ERROR_MESSAGES[status_code]['long']
            }
        }
    )


def validate_request(body: Dict[Any, Any], required: Dict[str, type]) -> Dict[str, Any]:
    """
    Validate a Request Body

    Parameters
    ----------
    body: :class:`dict`[:class:`Any`, :class:`Any`]
        The Request Body
    required: :class:`dict`[:class:`str`, :class:`type`]
        The Required Fields

    Raises
    ------
    :class:`HTTPException`
        The Request Body is Invalid

    Returns
    -------
    :class:`dict`[:class:`str`, :class:`Any`]
        The Validated Request Body
    """

    for key, value in required.items():
        if key not in body:
            raise HTTPException(400, f"'{key}' is Required")
        if not isinstance(body[key], value):
            raise HTTPException(400, f"'{key}' is Invalid")

    return body
