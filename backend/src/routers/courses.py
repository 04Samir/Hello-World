"""
The API Routes for the Courses
"""

from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException

from ..db import get_db, DataBase, Course, CourseCategory, CategoryTopic, User, UserCourse
from ..middleware import get_current_user
from ..utils import standard_response, JSONResponse


router = APIRouter()


async def _fetch_course_details(db: DataBase, course: dict, *, with_categories: bool = False, with_topics: bool = False) -> dict:
    if with_categories:
        categories = await CourseCategory.GetByID(db, course_id=course['id'])
        if categories:
            course['categories'] = [category.as_dict() for category in categories]

            if with_topics:
                for category in course['categories']:
                    topics = await CategoryTopic.GetAll(db, category_id=category['id'])
                    if len(topics) > 0:
                        category['topics'] = [topic.as_dict() for topic in topics]
    
    return course


@router.get("/courses")
async def get_all_courses(with_categories: bool = False, with_topics: bool = False, db: DataBase = Depends(get_db)) -> JSONResponse:
    courses = await Course.GetAll(db)
    courses = [
        await _fetch_course_details(
            db, course.as_dict(),
            with_categories=with_categories,
            with_topics=with_topics
        )
        for course in courses
    ]

    return standard_response(
        status_code=200,
        extra={'courses': courses}
    )


@router.get("/courses/{course_name}")
async def get_course_by_name(course_name: str, with_categories: bool = False, with_topics: bool = False, db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    course = await _fetch_course_details(
        db, course.as_dict(),
        with_categories=with_categories,
        with_topics=with_topics
    )
    
    return standard_response(
        status_code=200,
        extra={'course': course}
    )


@router.post("/courses/{course_name}/join")
async def join_course(course_name: str, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if check:
        raise HTTPException(400, "Already Joined to Course")
    
    await UserCourse.Create(db, user_id=current_user.id, course_id=course.id)

    return standard_response(
        status_code=201,
        extra={'message': f'Successfully Joined Course: {course.name}'}
    )


@router.delete("/courses/{course_name}/leave")
async def leave_course(course_name: str, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(400, "Not Joined to Course")
    else:
        check = check[0]

    await check.Delete(db)

    return standard_response(
        status_code=200,
        extra={'message': f'Successfully Left Course: {course.name}'}
    )
