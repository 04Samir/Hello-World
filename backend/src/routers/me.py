"""
The API Routes for the Current User
"""

from fastapi import APIRouter, Body, Depends
from fastapi.exceptions import HTTPException

import json
from pathlib import Path
from datetime import datetime

from ..db import (
    get_db, DataBase,
    Course, CourseCategory, CategoryTopic, Quiz,
    User, UserCourse, UserTopicQuiz,
    UserEvent, UserNotification, UserPreference
)
from ..middleware import get_current_user
from ..utils import (
    standard_response,
    validate_request,
    Hasher, 
    JSONResponse,
)


router = APIRouter()


@router.get("/@me")
async def get_user_info(current_user: User = Depends(get_current_user)) -> JSONResponse:
    return standard_response(
        status_code=200,
        extra={
            'user': current_user.as_dict(ignore=['password'])
        }
    )


@router.put("/@me")
async def update_user_info(payload: dict = Body(...), current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    keys = list(payload.keys())
    allowed_keys = ['display_name', 'username', 'password', 'bio', 'location']

    if any(key not in allowed_keys for key in keys):
        raise HTTPException(
            status_code=400,
            detail="Invalid Payload"
        )

    body = validate_request(payload, {key: str for key in allowed_keys})

    if ('display_name' in body) and (len(body['display_name']) > 30):
        raise HTTPException(400, "Display Name is Too Long")
    else:
        current_user.display_name = body['display_name']

    if ('username' in body) and (len(body['username']) > 30):
        raise HTTPException(400, "Username is Too Long")
    else:
        current_user.username = body['username']

    if 'password' in body:
        password = Hasher.hash_password(body['password'])
        if len(password) > 255:
            raise HTTPException(400, "Password is Too Long")
        else:
            current_user.password = password

    if ('bio' in body) and (len(body['bio']) > 100):
        raise HTTPException(400, "Bio is Too Long")
    else:
        current_user.bio = body['bio']

    if ('location' in body) and (len(body['location']) > 2):
        raise HTTPException(400, "Invalid Location")
    else:
        with open(str(Path(__file__).parents[1]) + "/" + "utils" + "/" + "countries.json", "r") as File:
            COUNTRIES = json.load(File)
            
        country = COUNTRIES.get(body['location'])
        if country is None:
            raise HTTPException(400, "Invalid Location")
        else:
            current_user.location = body['location']

    user = await current_user.Update(db)

    return standard_response(
        status_code=200,
        extra={
            'user': user.as_dict(ignore=['password'])
        }
    )


@router.delete("/@me")
async def delete_user(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    await current_user.Delete(db)

    return standard_response(
        status_code=200
    )


@router.get("/@me/courses")
async def get_user_courses(count_completed: bool = True, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    user_courses = await UserCourse.GetByID(db, user_id=current_user.id)
    courses = {
        'completed': [],
        'incomplete': []
    }
    for user_course in user_courses:
        course = await Course.GetByID(db, id=user_course.course_id)
        if course is not None:
            categories = await CourseCategory.GetByID(db, course_id=course.id)
            if categories:
                for category in categories:
                    topics = await CategoryTopic.GetAll(db, category_id=category.id)
                    if topics:
                        for topic in topics:
                            quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
                            if quiz:
                                user_quiz = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
                                if len(user_quiz) > 0:
                                    user_quiz = user_quiz[0]
                                    if user_quiz.submitted_at is not None and count_completed:
                                        courses['completed'].append(course.as_dict())
                                        continue

            courses['incomplete'].append(course.as_dict())

    return standard_response(
        status_code=200,
        extra={
            'courses': courses
        }
    )


@router.get("/@me/events")
async def get_user_events(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    user_events = await UserEvent.GetAllByUserID(db, user_id=current_user.id)

    return standard_response(
        status_code=200,
        extra={
            'events': [event.as_dict() for event in user_events]
        }
    )


@router.post("/@me/events")
async def create_user_event(event_data: dict = Body(...), current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    body = validate_request(event_data, {
        'title': str,
        'description': str,
        'start_date': str,
        'end_date': str
    })

    if len(body['title']) > 100:
        raise HTTPException(400, "Title is Too Long")
    
    if len(body['description']) > 255:
        raise HTTPException(400, "Description is Too Long")
    
    event = await UserEvent.Create(
        db,
        user_id=current_user.id,
        title=body['title'],
        content=body['description'],
        start_date=body['start_date'],
        end_date=body['end_date']
    )

    return standard_response(
        status_code=201,
        extra={'event': event.as_dict()}
    )


@router.put("/@me/events/{event_id}")
async def update_user_event(event_id: int, event_data: dict = Body(...), current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    event = await UserEvent.GetByID(db, id=event_id)

    if event is None:
        raise HTTPException(404, "Event Not Found")
    
    if event.user_id != current_user.id:
        raise HTTPException(403, "Forbidden")
    
    body = validate_request(event_data, {
        'title': str,
        'description': str,
        'start_date': str,
        'end_date': str
    })

    if len(body['title']) > 100:
        raise HTTPException(400, "Title is Too Long")
    else:
        event.title = body['title']

    if len(body['description']) > 255:
        raise HTTPException(400, "Description is Too Long")
    else:
        event.content = body['description']

    event.start_date = datetime.strptime(body['start_date'], "%Y-%m-%d %H:%M:%S")
    event.end_date = datetime.strptime(body['end_date'], "%Y-%m-%d %H:%M:%S")

    await event.Update(db)

    return standard_response(
        status_code=200,
        extra={'event': event.as_dict()}
    )


@router.delete("/@me/events/{event_id}")
async def delete_user_event(event_id: int, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    event = await UserEvent.GetByID(db, id=event_id)

    if event is None:
        raise HTTPException(404, "Event Not Found")
    
    if event.user_id != current_user.id:
        raise HTTPException(403, "Forbidden")

    await event.Delete(db)

    return standard_response(
        status_code=200
    )


@router.get("/@me/notifications")
async def get_user_notifications(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    notifications = await UserNotification.GetAllByUserID(db, user_id=current_user.id)

    return standard_response(
        status_code=200,
        extra={
            'notifications': [notification.as_dict() for notification in notifications]
        }
    )


@router.delete("/@me/notifications/{notification_id}")
async def delete_user_notification(notification_id: int, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    notification = await UserNotification.GetByID(db, id=notification_id)

    if notification is None:
        raise HTTPException(404, "Notification Not Found")
    
    if notification.user_id != current_user.id:
        raise HTTPException(403, "Forbidden")
    
    await notification.Delete(db)

    return standard_response(
        status_code=200,
        extra={
            'message': 'Successfully Deleted Notification!'
        }
    )


@router.delete("/@me/notifications")
async def delete_all_user_notifications(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    notifications = await UserNotification.GetAllByUserID(db, user_id=current_user.id)

    for notification in notifications:
        await notification.Delete(db)

    return standard_response(
        status_code=200,
        extra={
            'message': 'Successfully Deleted All Notifications!'
        }
    )


@router.get("/@me/preferences")
async def get_user_preferences(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    preference = await UserPreference.GetByUserID(db, user_id=current_user.id)

    return standard_response(
        status_code=200,
        extra={
            'preferences': preference.as_dict()
        }
    )


@router.put("/@me/preferences")
async def update_user_preferences(preference_data: dict = Body(...), current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    preference = await UserPreference.GetByUserID(db, user_id=current_user.id)

    body = validate_request(preference_data, {
        'daily_quiz_reminder': bool,
        'weekly_newsletter': bool
    })

    preference.daily_quiz_reminder = body['daily_quiz_reminder']
    preference.weekly_newsletter = body['weekly_newsletter']

    await preference.Update(db)

    return standard_response(
        status_code=200,
        extra={
            'preferences': preference.as_dict()
        }
    )
