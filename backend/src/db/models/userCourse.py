"""
The Model for the UserCourses Table
"""

from sqlalchemy import func, ForeignKey, Integer, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class UserCourse(Base):
    """"User Course Model"""

    __tablename__ = "UserCourses"

    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), primary_key=True, index=True)
    course_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Courses.id", ondelete="CASCADE"), primary_key=True, index=True)
    joined_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, user_id: int, course_id: int) -> 'UserCourse':
        """
        Create a New User Course

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        course_id: :class:`int`
            The ID of the Course

        Returns
        -------
        :class:`UserCourse`
            The User Course
        """

        user_course = cls(user_id=user_id, course_id=course_id)
        db.add(user_course)
        await db.commit()
        await db.refresh(user_course)
        return user_course
    

    @staticmethod
    async def GetByID(db: DataBase, *, user_id: Optional[int] = None, course_id: Optional[int] = None) -> 'list[UserCourse]':
        """
        Get a User Course by User ID & Course ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: Optional[:class:`int`]
            The ID of the User
        course_id: Optional[:class:`int`]
            The ID of the Course

        Raises
        ------
        ValueError
            Missing Required Argument

        Returns
        -------
        :class:`list[UserCourse]`
            The User Course
        """

        if user_id and course_id:
            result = await db.execute(select(UserCourse).filter_by(user_id=user_id, course_id=course_id))
            return list(result.scalars().all())
        elif user_id:
            results = await db.execute(select(UserCourse).filter_by(user_id=user_id))
            return list(results.scalars().all())
        elif course_id:
            results = await db.execute(select(UserCourse).filter_by(course_id=course_id))
            return list(results.scalars().all())
        else:
            raise ValueError("Missing Required Argument: 'user_id' or 'course_id'")


    async def Delete(self, db: DataBase) -> bool:
        """
        Delete a User Course

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
