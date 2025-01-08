"""
The Model for the QuizQuestions Table
"""

from sqlalchemy import func, Enum, ForeignKey, Integer, TEXT, JSON, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime

from ..connector import Base, AsyncSession as DataBase


class QuizQuestion(Base):
    """Quiz Question Model"""

    __tablename__ = "QuizQuestions"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    quiz_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Quizzes.id", ondelete="CASCADE"), nullable=False)
    type: MappedColumn[str] = mapped_column(Enum("single", "multiple"), nullable=False)
    question: MappedColumn[str] = mapped_column(TEXT, nullable=False)
    answers: MappedColumn[str] = mapped_column(TEXT, nullable=False)
    correct_answer_index: MappedColumn[dict] = mapped_column(JSON, nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, quiz_id: int, type: str, question: str, answers: str, correct_answer_index: dict) -> 'QuizQuestion':
        """
        Create a New Quiz Question

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        quiz_id: :class:`int`
            The ID of the Quiz
        type: :class:`str`
            The Type of the Question
        question: :class:`str`
            The Question
        answers: :class:`str`
            The Answers
        correct_answer_index: :class:`dict`
            The Correct Answer Index

        Returns
        -------
        :class:`QuizQuestion`
            The Quiz Question
        """

        quiz_question = cls(quiz_id=quiz_id, type=type, question=question, answers=answers, correct_answer_index=correct_answer_index)
        db.add(quiz_question)
        await db.commit()
        return quiz_question
    

    @staticmethod
    async def GetAll(db: DataBase, *, quiz_id: int) -> 'list[QuizQuestion]':
        """
        Get All Questions of a Quiz

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        quiz_id: :class:`int`
            The ID of the Quiz

        Returns
        -------
        :class:`list[QuizQuestion]`
            The List of Questions
        """

        results = await db.execute(select(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id))
        return list(results.scalars().all())
    

    @staticmethod
    async def GetByID(db: DataBase, *, quiz_id: int, id: int) -> 'QuizQuestion | None':
        """
        Get a Question by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        quiz_id: :class:`int`
            The ID of the Quiz
        id: :class:`int`
            The ID of the Question

        Returns
        -------
        :class:`QuizQuestion | None`
            The Question
        """

        result = await db.execute(select(QuizQuestion).filter_by(quiz_id=quiz_id, id=id))
        return result.scalar() if result else None
    

    async def Update(self, db: DataBase) -> 'QuizQuestion':
        """
        Update the Question

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`QuizQuestion`
            The Updated Question
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Question

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
