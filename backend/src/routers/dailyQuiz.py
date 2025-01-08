"""
The API Routes for the Daily Quiz
"""

from fastapi import APIRouter, Body, Depends
from fastapi.exceptions import HTTPException

from ..db import (
    get_db, DataBase,
    Quiz, QuizQuestion,
    User, UserTopicQuiz, UserQuizAnswer
)
from ..middleware import get_current_user
from ..utils import standard_response, JSONResponse


router = APIRouter()


@router.get("/daily-quiz/stats")
async def get_daily_quiz_stats(db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id)
    questions = await QuizQuestion.GetAll(db, quiz_id=daily_quiz.id)

    users = {}
    if len(attempts) > 0:
        for attempt in attempts:
            user = await User.GetByID(db, user_id=attempt.user_id)
            if user:
                users[user.id] = {'user': user.as_dict(ignore=['password']), 'score': 0}
                answers = await UserQuizAnswer.GetAllByQuizID(db, user_id=user.id, quiz_id=daily_quiz.id)
                for question in questions:
                    wrong_answers = []
                    correct_answers = question.correct_answer_index
                    user_answers = next((ans for ans in answers if ans.question_id == question.id), None)
                    if user_answers:
                        for qid, actual_answer in correct_answers.items():
                            if user_answers.chosen_answers_index.get(qid) != actual_answer:
                                wrong_answers.append(user_answers.chosen_answers_index.get(qid))

                    if wrong_answers == []:
                        users[user.id] = users[user.id]['score'] + 1

    return standard_response(
        status_code=200,
        extra={'stats': {
            'total_attempts': len(attempts),
            'total_questions': len(questions),
            'users': users
        }}
    )


@router.get("/daily-quiz/questions")
async def get_daily_quiz_questions(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id, user_id=current_user.id)
    if len(attempts) != 0:
        raise HTTPException(403, "You have Already Attempted the Daily Quiz")
    
    daily_quiz = daily_quiz.as_dict()
    questions = await QuizQuestion.GetAll(db, quiz_id=daily_quiz['id'])
    daily_quiz['questions'] = [question.as_dict(ignore=['correct_answer_index']) for question in questions]

    return standard_response(
        status_code=200,
        extra={'quiz': daily_quiz}
    )


@router.get("/daily-quiz/questions/{question_id}")
async def get_daily_quiz_question_by_id(question_id: int, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id, user_id=current_user.id)
    if len(attempts) != 0:
        raise HTTPException(403, "You have Already Attempted the Daily Quiz")
    
    question = await QuizQuestion.GetByID(db, quiz_id=daily_quiz.id, id=question_id)
    if not question:
        raise HTTPException(404, "Question Not Found")
    
    question = question.as_dict(ignore=['correct_answer_index'])

    return standard_response(
        status_code=200,
        extra={'question': question}
    )


@router.get("/daily-quiz/questions/{question_id}/answer")
async def get_daily_quiz_answer_by_id(question_id: int, current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id, user_id=current_user.id)
    if len(attempts) != 0:
        raise HTTPException(403, "You have Already Attempted the Daily Quiz")
    
    question = await QuizQuestion.GetByID(db, quiz_id=daily_quiz.id, id=question_id)
    if not question:
        raise HTTPException(404, "Question Not Found")
    
    answer = await UserQuizAnswer.GetByID(db, user_id=current_user.id, quiz_id=daily_quiz.id, question_id=question.id)
    if not answer:
        raise HTTPException(404, "Answer Not Found")
    
    return standard_response(
        status_code=200,
        extra={'answer': answer.as_dict()}
    )


@router.post("/daily-quiz/questions/{question_id}/answer")
async def submit_daily_quiz_answer(question_id: int, payload: dict = Body(...), current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id, user_id=current_user.id)
    if len(attempts) != 0:
        raise HTTPException(403, "You have Already Attempted the Daily Quiz")
    
    question = await QuizQuestion.GetByID(db, quiz_id=daily_quiz.id, id=question_id)
    if not question:
        raise HTTPException(404, "Question Not Found")
    
    chosen_answers = dict(enumerate(payload.get('chosen_answers', [])))
    if chosen_answers == {}:
        return standard_response(
            status_code=200,
            extra={'answer': None}
        )
    
    answer = await UserQuizAnswer.GetByID(db, user_id=current_user.id, quiz_id=daily_quiz.id, question_id=question.id)
    if answer:
        answer.chosen_answers_index = chosen_answers
        await answer.Update(db)
    else:
        answer = await UserQuizAnswer.Create(
            db,
            user_id=current_user.id,
            quiz_id=daily_quiz.id,
            question_id=question.id,
            chosen_answers_index=chosen_answers
        )
        await answer.Save(db)

    return standard_response(
        status_code=200,
        extra={'answer': answer.as_dict()}
    )


@router.post("/daily-quiz/submit")
async def submit_daily_quiz(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id, user_id=current_user.id)
    if len(attempts) != 0:
        raise HTTPException(403, "You have Already Attempted the Daily Quiz")
    
    questions = await QuizQuestion.GetAll(db, quiz_id=daily_quiz.id)
    answers = await UserQuizAnswer.GetAllByQuizID(db, user_id=current_user.id, quiz_id=daily_quiz.id)

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
        quiz_id=daily_quiz.id
    )

    current_user.points += sum(1 for result in results.values() if result['wrong_answers'] == [])
    await current_user.Update(db)
    
    return standard_response(
        status_code=200,
        extra={'results': results}
    )


@router.get("/daily-quiz/results")
async def get_daily_quiz_results(current_user: User = Depends(get_current_user), db: DataBase = Depends(get_db)) -> JSONResponse:
    daily_quiz = await Quiz.GetDailyQuiz(db)
    if not daily_quiz:
        raise HTTPException(404, "Daily Quiz Not Found")
    
    attempts = await UserTopicQuiz.GetByID(db, quiz_id=daily_quiz.id, user_id=current_user.id)
    if len(attempts) == 0:
        raise HTTPException(403, "You have Not Attempted the Daily Quiz")
    
    questions = await QuizQuestion.GetAll(db, quiz_id=daily_quiz.id)
    answers = await UserQuizAnswer.GetAllByQuizID(db, user_id=current_user.id, quiz_id=daily_quiz.id)

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
