"""
The API Routes for the Quiz
"""

from fastapi import APIRouter, Body, Depends
from fastapi.exceptions import HTTPException

from ..db import (
    get_db, DataBase,
    CategoryTopic, Course,
    Quiz, QuizQuestion,
    User, UserCourse, UserTopicQuiz, UserQuizAnswer
)
from ..middleware import get_current_user
from ..utils import standard_response, JSONResponse


router = APIRouter()


@router.get("/courses/{course_name}/topics/{topic_name}/quiz/questions")
async def get_quiz_by_topic(course_name: str, topic_name: str, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(403, "You are Not Enrolled in this Course")

    topic = await CategoryTopic.GetByName(db, name=topic_name)
    if not topic:
        raise HTTPException(404, "Topic Not Found")

    quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
    if not quiz:
        raise HTTPException(404, "Quiz Not Found")
    else:
        check = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
        if len(check) != 0:
            raise HTTPException(403, "You have Already Attempted this Quiz")

    quiz = quiz.as_dict()
    questions = await QuizQuestion.GetAll(db, quiz_id=quiz['id'])
    quiz['questions'] = [question.as_dict(ignore=['correct_answer_index']) for question in questions]

    return standard_response(
        status_code=200,
        extra={'quiz': quiz}
    )


@router.get("/courses/{course_name}/topics/{topic_name}/quiz/questions/{question_id}")
async def get_question_by_id(course_name: str, topic_name: str, question_id: int, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(403, "You are Not Enrolled in this Course")

    topic = await CategoryTopic.GetByName(db, name=topic_name)
    if not topic:
        raise HTTPException(404, "Topic Not Found")

    quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
    if not quiz:
        raise HTTPException(404, "Quiz Not Found")
    else:
        check = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
        if len(check) != 0:
            raise HTTPException(403, "You have Already Attempted this Quiz")
   
    question = await QuizQuestion.GetByID(db, quiz_id=quiz.id, id=question_id)
    if not question:
        raise HTTPException(404, "Question Not Found")
    else:
        question = question.as_dict(ignore=['correct_answer_index'])

    return standard_response(
        status_code=200,
        extra={'question': question}
    )


@router.get("/courses/{course_name}/topics/{topic_name}/quiz/questions/{question_id}/answer")
async def get_answer_by_id(course_name: str, topic_name: str, question_id: int, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(403, "You are Not Enrolled in this Course")

    topic = await CategoryTopic.GetByName(db, name=topic_name)
    if not topic:
        raise HTTPException(404, "Topic Not Found")

    quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
    if not quiz:
        raise HTTPException(404, "Quiz Not Found")
    else:
        check = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
        if len(check) != 0:
            raise HTTPException(403, "You have Already Attempted this Quiz")
   
    question = await QuizQuestion.GetByID(db, quiz_id=quiz.id, id=question_id)
    if not question:
        raise HTTPException(404, "Question Not Found")
    
    answer = await UserQuizAnswer.GetByID(db, user_id=current_user.id, quiz_id=quiz.id, question_id=question.id)
    if not answer:
        raise HTTPException(404, "Answer Not Found")
    
    return standard_response(
        status_code=200,
        extra={'answer': answer.as_dict()}
    )


@router.post("/courses/{course_name}/topics/{topic_name}/quiz/questions/{question_id}/answer")
async def submit_answer(course_name: str, topic_name: str, question_id: int, payload: dict = Body(...), current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(403, "You are Not Enrolled in this Course")

    topic = await CategoryTopic.GetByName(db, name=topic_name)
    if not topic:
        raise HTTPException(404, "Topic Not Found")

    quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
    if not quiz:
        raise HTTPException(404, "Quiz Not Found")
    else:
        check = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
        if len(check) != 0:
            raise HTTPException(403, "You have Already Attempted this Quiz")
   
    question = await QuizQuestion.GetByID(db, quiz_id=quiz.id, id=question_id)
    if not question:
        raise HTTPException(404, "Question Not Found")

    chosen_answers = dict(enumerate(payload.get('chosen_answers', [])))
    if chosen_answers == {}:
        return standard_response(
            status_code=200,
            extra={'answer': None}
        )
    
    answer = await UserQuizAnswer.GetByID(db, user_id=current_user.id, quiz_id=quiz.id, question_id=question.id)
    if answer:
        answer.chosen_answers_index = chosen_answers
        await answer.Update(db)
    else:
        answer = await UserQuizAnswer.Create(
            db,
            user_id=current_user.id,
            quiz_id=quiz.id,
            question_id=question.id,
            chosen_answers_index=chosen_answers
        )
        await answer.Save(db)

    return standard_response(
        status_code=200,
        extra={'answer': answer.as_dict()}
    )


@router.post("/courses/{course_name}/topics/{topic_name}/quiz/submit")
async def submit_quiz(course_name: str, topic_name: str, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(403, "You are Not Enrolled in this Course")

    topic = await CategoryTopic.GetByName(db, name=topic_name)
    if not topic:
        raise HTTPException(404, "Topic Not Found")

    quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
    if not quiz:
        raise HTTPException(404, "Quiz Not Found")
    else:
        check = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
        if len(check) != 0:
            raise HTTPException(403, "You have Already Attempted this Quiz")
        
    questions = await QuizQuestion.GetAll(db, quiz_id=quiz.id)
    answers = await UserQuizAnswer.GetAllByQuizID(db, user_id=current_user.id, quiz_id=quiz.id)

    results = {}
    for i, question in enumerate(questions, 1):
        wrong_answers = []
        correct_answers = question.correct_answer_index
        user_answers = next((ans for ans in answers if ans.question_id == question.id), None)
        if user_answers:
            for qid, actual_answer in correct_answers.items():
                if user_answers.chosen_answers_index.get(qid) != actual_answer:
                    wrong_answers.append(user_answers.chosen_answers_index.get(qid))
        else:
            wrong_answers = list(correct_answers.values())

        results[i] = {
            'question': question.as_dict(ignore=['correct_answer_index']),
            'correct_answers': correct_answers,
            'wrong_answers': wrong_answers
        }

    await UserTopicQuiz.Create(
        db,
        user_id=current_user.id,
        quiz_id=quiz.id
    )

    return standard_response(
        status_code=200,
        extra={'results': results}
    )


@router.get("/courses/{course_name}/topics/{topic_name}/quiz/results")
async def get_quiz_results(course_name: str, topic_name: str, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    course = await Course.GetByName(db, name=course_name)
    if not course:
        raise HTTPException(404, "Course Not Found")
    
    check = await UserCourse.GetByID(db, user_id=current_user.id, course_id=course.id)
    if len(check) == 0:
        raise HTTPException(403, "You are Not Enrolled in this Course")

    topic = await CategoryTopic.GetByName(db, name=topic_name)
    if not topic:
        raise HTTPException(404, "Topic Not Found")

    quiz = await Quiz.GetByTopic(db, topic_id=topic.id)
    if not quiz:
        raise HTTPException(404, "Quiz Not Found")
    else:
        check = await UserTopicQuiz.GetByID(db, user_id=current_user.id, quiz_id=quiz.id)
        if len(check) == 0:
            raise HTTPException(403, "You have Not Attempted this Quiz")
        
    questions = await QuizQuestion.GetAll(db, quiz_id=quiz.id)
    answers = await UserQuizAnswer.GetAllByQuizID(db, user_id=current_user.id, quiz_id=quiz.id)

    results = {}
    for i, question in enumerate(questions, 1):
        wrong_answers = []
        correct_answers = question.correct_answer_index
        user_answers = next((ans for ans in answers if ans.question_id == question.id), None)
        if user_answers:
            for qid, actual_answer in correct_answers.items():
                if user_answers.chosen_answers_index.get(qid) != actual_answer:
                    wrong_answers.append(user_answers.chosen_answers_index.get(qid))
        else:
            wrong_answers = list(correct_answers.values())

        results[i] = {
            'question': question.as_dict(ignore=['correct_answer_index']),
            'correct_answers': correct_answers,
            'wrong_answers': wrong_answers
        }

    return standard_response(
        status_code=200,
        extra={'results': results}
    )
