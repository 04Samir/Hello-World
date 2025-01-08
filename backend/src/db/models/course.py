"""
The Model for the Courses Table
"""

from sqlalchemy import func, Integer, String, TEXT, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime

from ..connector import Base, AsyncSession as DataBase


class Course(Base):
    """Course Model"""
    
    __tablename__ = "Courses"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: MappedColumn[str] = mapped_column(String(100), nullable=False, unique=True)
    short_name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    description: MappedColumn[str] = mapped_column(TEXT, nullable=False)
    language: MappedColumn[str] = mapped_column(String(30), nullable=False)
    icon_name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    updated_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, name: str, short_name: str, description: str, language: str, icon_name: str) -> 'Course':
        """
        Create a New Course

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        name: :class:`str`
            The Name of the Course
        short_name: :class:`str`
            The Short Name of the Course
        description: :class:`str`
            The Description of the Course
        language: :class:`str`
            The Language of the Course
        icon_name: :class:`str`
            The Icon Name of the Course

        Returns
        -------
        :class:`Course`
            The Course
        """

        course = cls(name=name, short_name=short_name, description=description, language=language, icon_name=icon_name)
        db.add(course)
        await db.commit()
        await db.refresh(course)
        return course


    @staticmethod
    async def GetAll(db: DataBase) -> list['Course']:
        """
        Get All Courses

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        List[:class:`Course`]
            The Courses
        """

        result = await db.execute(select(Course).order_by(Course.name))
        return list(result.scalars().all())
    

    @staticmethod
    async def GetByID(db: DataBase, *, id: int) -> 'Course | None':
        """
        Get a Course by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        id: :class:`int`
            The ID of the Course

        Returns
        -------
        Optional[:class:`Course`]
            The Course
        """

        result = await db.execute(select(Course).where(Course.id == id))
        return result.scalar() if result else None


    @staticmethod
    async def GetByName(db: DataBase, *, name: str) -> 'Course | None':
        """
        Get a Course by its Name

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        name: :class:`str`
            The Name of the Course

        Returns
        -------
        Optional[:class:`Course`]
            The Course
        """

        result = await db.execute(select(Course).where(Course.name == name))
        return result.scalar() if result else None
    

    async def Update(self, db: DataBase) -> 'Course':
        """
        Update the Course

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`Course`
            The Course
        """

        await db.commit()
        await db.refresh(self)
        return self


    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Course

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
