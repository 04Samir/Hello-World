"""
The Model for the CourseCategories Table
"""

from sqlalchemy import func, ForeignKey, Integer, String, TEXT, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class CourseCategory(Base):
    """Course Category Model"""

    __tablename__ = "CourseCategories"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Courses.id", ondelete="CASCADE"), nullable=False)
    name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    short_name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    description: MappedColumn[str] = mapped_column(TEXT, nullable=False)
    updated_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, course_id: int, name: str, short_name: str, description: str) -> 'CourseCategory':
        """
        Create a New Course Category

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        course_id: :class:`int`
            The ID of the Course
        name: :class:`str`
            The Name of the Course Category
        short_name: :class:`str`
            The Short Name of the Course Category
        description: :class:`str`
            The Description of the Course Category

        Returns
        -------
        :class:`CourseCategory`
            The Course Category
        """

        category = cls(course_id=course_id, name=name, short_name=short_name, description=description)
        db.add(category)
        await db.commit()
        await db.refresh(category)
        return category


    @staticmethod
    async def GetByID(db: DataBase, *, category_id: Optional[int] = None, course_id: Optional[int] = None) -> 'CourseCategory | list[CourseCategory] | None':
        """
        Get a Course Category by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        category_id: Optional[:class:`int`]
            The ID of the Course Category
        course_id: Optional[:class:`int`]
            The ID of the Course

        Raises
        ------
        ValueError
            Missing Required Argument

        Returns
        -------
        Optional[:class:`CourseCategory` | List[:class:`CourseCategory`]]
            The Course Category(s)
        """

        if category_id:
            result = await db.execute(select(CourseCategory).where(CourseCategory.id == category_id).order_by(CourseCategory.created_at.desc()))
            return result.scalar() if result else None
        elif course_id:
            results = await db.execute(select(CourseCategory).where(CourseCategory.course_id == course_id).order_by(CourseCategory.created_at.desc()))
            return list(results.scalars().all())
        else:
            raise ValueError("Missing Required Argument: 'category_id' or 'course_id'")
        

    @staticmethod
    async def GetByName(db: DataBase, *, name: str) -> 'CourseCategory | None':
        """
        Get a Course Category by its Name

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        name: :class:`str`
            The Name of the Course Category

        Returns
        -------
        Optional[:class:`CourseCategory`]
            The Course Category
        """

        result = await db.execute(select(CourseCategory).where(CourseCategory.name == name))
        return result.scalar() if result else None


    async def Update(self, db: DataBase) -> 'CourseCategory':
        """
        Update the Course Category

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`CourseCategory`
            The Course Category
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Course Category

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
