"""
The Model for the UserQuizAnswers Table
"""

from sqlalchemy import func, ForeignKey, Integer, JSON, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class UserQuizAnswer(Base):
    """User Quiz Answer Model"""

    __tablename__ = "UserQuizAnswers"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    quiz_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Quizzes.id", ondelete="CASCADE"), nullable=False)
    question_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("QuizQuestions.id", ondelete="CASCADE"), nullable=False)
    chosen_answers_index: MappedColumn[dict] = mapped_column(JSON, nullable=False)
    answered_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
    modified_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, user_id: int, quiz_id: int, question_id: int, chosen_answers_index: dict) -> 'UserQuizAnswer':
        """
        Create a New User Quiz Answer

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        quiz_id: :class:`int`
            The ID of the Quiz
        question_id: :class:`int`
            The ID of the Question
        chosen_answers_index: :class:`dict`
            The Chosen Answers Index

        Returns
        -------
        :class:`UserQuizAnswer`
        """

        quiz_answer = cls(user_id=user_id, quiz_id=quiz_id, question_id=question_id, chosen_answers_index=chosen_answers_index)
        db.add(quiz_answer)
        await db.commit()
        await db.refresh(quiz_answer)
        return quiz_answer


    @staticmethod
    async def GetAllByQuizID(db: DataBase, *, user_id: int, quiz_id: int) -> 'list[UserQuizAnswer]':
        """
        Get All User Quiz Answers by User ID & Quiz ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        quiz_id: :class:`int`
            The ID of the Quiz

        Returns
        -------
        :class:`list[UserQuizAnswer]`
            The List of User Quiz Answers
        """

        results = await db.execute(select(UserQuizAnswer).filter_by(user_id=user_id, quiz_id=quiz_id))
        return list(results.scalars().all())
    

    @staticmethod
    async def GetByID(db: DataBase, *, user_id: int, question_id: int, quiz_id: int) -> 'UserQuizAnswer | None':
        """
        Get a User Quiz Answer by User ID, Question ID & Quiz ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        question_id: :class:`int`
            The ID of the Question
        quiz_id: :class:`int`
            The ID of the Quiz

        Returns
        -------
        :class:`UserQuizAnswer | None`
            The User Quiz Answer
        """

        result = await db.execute(select(UserQuizAnswer).filter_by(user_id=user_id, question_id=question_id, quiz_id=quiz_id))
        return result.scalar() if result else None
    

    async def Update(self, db: DataBase) -> 'UserQuizAnswer':
        """
        Update the User Quiz Answer

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`UserQuizAnswer`
            The User Quiz Answer
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the User Quiz Answer

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`bool`
            The Deletion Status
        """

        await db.delete(self)
        await db.commit()
        return True
