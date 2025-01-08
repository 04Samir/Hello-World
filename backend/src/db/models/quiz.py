"""
The Model for the Quizzes Table
"""

from sqlalchemy import func, Enum, ForeignKey, Integer, String, DATETIME, TEXT, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime, timezone
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class Quiz(Base):
    """Quiz Model"""

    __tablename__ = "Quizzes"
    
    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    type: MappedColumn[str] = mapped_column(Enum("topic", "daily"), nullable=False)
    topic_id: MappedColumn[Optional[int]] = mapped_column(Integer, ForeignKey("CategoryTopics.id", ondelete="CASCADE"), unique=True)
    name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    short_name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    description: MappedColumn[str] = mapped_column(TEXT, nullable=False)
    opens_at: MappedColumn[Optional[datetime]] = mapped_column(DATETIME)
    closes_at: MappedColumn[Optional[datetime]] = mapped_column(DATETIME)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
    

    @classmethod
    async def Create(cls, db: DataBase, *, type: str, topic_id: Optional[int] = None, name: str, short_name: str, description: str, opens_at: Optional[datetime] = None, closes_at: Optional[datetime] = None) -> 'Quiz':
        """
        Create a New Quiz

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        type: :class:`str`
            The Type of the Quiz
        topic_id: :class:`int`
            The ID of the Category Topic
        name: :class:`str`
            The Name of the Quiz
        short_name: :class:`str`
            The Short Name of the Quiz
        description: :class:`str`
            The Description of the Quiz
        opens_at: :class:`Optional[datetime]`
            The Time the Quiz Opens
        closes_at: :class:`Optional[datetime]`
            The Time the Quiz Closes

        Returns
        -------
        :class:`Quiz`
            The Quiz
        """

        quiz = cls(type=type, topic_id=topic_id, name=name, short_name=short_name, description=description, opens_at=opens_at, closes_at=closes_at)
        db.add(quiz)
        await db.commit()
        await db.refresh(quiz)
        return quiz
    

    @staticmethod
    async def GetByTopic(db: DataBase, *, topic_id: int) -> 'Quiz | None':
        """
        Get a Quiz by its Category Topic

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        topic_id: :class:`int`
            The ID of the Category Topic

        Returns
        -------
        :class:`Quiz | None`
            The Quiz
        """

        result = await db.execute(select(Quiz).filter(Quiz.topic_id == topic_id))
        return result.scalar() if result else None
    

    @staticmethod
    async def GetByID(db: DataBase, *, quiz_id: Optional[int] = None) -> 'Quiz | None':
        """
        Get a Quiz by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        quiz_id: :class:`Optional[int]`
            The ID of the Quiz

        Returns
        -------
        :class:`Quiz | None`
            The Quiz
        """

        result = await db.execute(select(Quiz).filter(Quiz.id == quiz_id))
        return result.scalar() if result else None
    

    @staticmethod
    async def GetDailyQuiz(db: DataBase, *, date: Optional[datetime] = None) -> 'Quiz | None':
        """
        Get the Daily Quiz

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        date: :class:`Optional[datetime]`
            The Date

        Returns
        -------
        :class:`Quiz | None`
            The Quiz
        """

        if not date:
            date = datetime.now(timezone.utc)
        
        result = await db.execute(select(Quiz).filter(Quiz.type == "daily").filter(Quiz.opens_at <= date).filter(Quiz.closes_at >= date))
        return result.scalar() if result else None
    

    async def Update(self, db: DataBase) -> 'Quiz':
        """
        Update the Quiz

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`Quiz`
            The Updated Quiz
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Quiz

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`bool`
            The Result of the Deletion
        """

        await db.delete(self)
        await db.commit()
        return True
