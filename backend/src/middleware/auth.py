"""
The Middleware for the Authentication System
"""

from fastapi import Request
from fastapi.exceptions import HTTPException

import httpx
import json
from pathlib import Path
from user_agents import parse


async def resolve_user_info(request: Request, *, find_device: bool = True, find_location: bool = True, find_country: bool = True) -> dict[str, str]:
    """
    Resolve the User's Device, Location, & Country

    Parameters
    ----------
    request: :class:`fastapi.Request`
        The Request Object
    find_device: :class:`bool`
        Whether to Find the Device
    find_location: :class:`bool`
        Whether to Find the Location
    find_country: :class:`bool`
        Whether to Find the Country

    Raises
    ------
    HTTPException
        If the Request is Invalid

    Returns
    -------
    :class:`dict`[:class:`str`, :class:`str`]
        The User's Information
    """

    user_info = {}
    
    user_ip = request.client.host if request.client else request.headers.get('x-forwarded-for')
    user_agent = request.headers.get('user-agent')

    if (find_device) and not user_agent:
        raise HTTPException(400, "Invalid Request")
    
    if (find_location or find_country) and not user_ip:
        raise HTTPException(400, "Invalid Request")
    
    if find_device:
        parsed_ua = parse(user_agent)
        family = parsed_ua.browser.family
        os_family = parsed_ua.os.family
        os_version = parsed_ua.os.version_string
        if any(value is None or value == "Other" for value in [family, os_family, os_version]):
            device = "Unknown"
        else:
            device = f"{family} on {os_family} {os_version}"
        user_info['device'] = device
    
    if (find_location or find_country): 
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ip-api.com/json/{user_ip}", params={'fields': '49179'})
            data = response.json()
            if data['status'] != 'success' and request.app.debug is False:
                raise HTTPException(400, "Invalid Request")
        
        city = data.get('city')
        region = data.get('regionName')
        country = data.get('country')
        country_code = data.get('countryCode', 'GB')
        if not all([city, region, country, country_code]) and request.app.debug is False:
            raise HTTPException(400, "Invalid Request")
        elif request.app.debug is True:
            location = "Unknown"
        else:
            location = f"{city}, {region}, {country}"
        user_info['location'] = location

        if find_country:
            with open(str(Path(__file__).parents[1]) + "/" + "utils" + "/" + "countries.json", "r") as File:
                COUNTRIES = json.load(File)

            country = COUNTRIES.get(country_code.upper())
            if not country:
                raise HTTPException(400, "Invalid Request")

            user_info['country'] = country_code

    return user_info
