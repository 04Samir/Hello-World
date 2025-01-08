"""
The Model for the UserTopicQuizzes Table
"""

from sqlalchemy import func, ForeignKey, Integer, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class UserTopicQuiz(Base):
    """User Topic Quiz Model"""

    __tablename__ = "UserTopicQuizzes"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    quiz_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Quizzes.id", ondelete="CASCADE"), nullable=False)
    started_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
    submitted_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, user_id: int, quiz_id: int) -> 'UserTopicQuiz':
        """
        Create a New User Topic Quiz

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
        :class:`UserTopicQuiz`
            The User Topic Quiz
        """

        user_topic_quiz = cls(user_id=user_id, quiz_id=quiz_id)
        db.add(user_topic_quiz)
        await db.commit()
        await db.refresh(user_topic_quiz)
        return user_topic_quiz
    

    @staticmethod
    async def GetByID(db: DataBase, *, user_id: Optional[int] = None, quiz_id: Optional[int] = None) -> 'list[UserTopicQuiz]':
        """
        Get a User Topic Quiz by User ID & Quiz ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: Optional[:class:`int`]
            The ID of the User
        quiz_id: Optional[:class:`int`]
            The ID of the Quiz

        Raises
        ------
        :class:`ValueError`
            Missing Required Argument

        Returns
        -------
        :class:`UserTopicQuiz | list[UserTopicQuiz] | None`
            The User Topic Quiz
        """

        if user_id and quiz_id:
            result = await db.execute(select(UserTopicQuiz).filter_by(user_id=user_id, quiz_id=quiz_id))
            return list(result.scalars().all())
        
        elif user_id:
            results = await db.execute(select(UserTopicQuiz).filter_by(user_id=user_id))
            return list(results.scalars().all())
        
        elif quiz_id:
            results = await db.execute(select(UserTopicQuiz).filter_by(quiz_id=quiz_id))
            return list(results.scalars().all())
        
        else:
            raise ValueError("Missing Required Argument: 'user_id' or 'quiz_id'")
