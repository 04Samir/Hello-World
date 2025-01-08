"""
The Model for the CourseTopics Table
"""

from sqlalchemy import func, ForeignKey, Integer, String, TEXT, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class CategoryTopic(Base):
    """Category Topic Model"""

    __tablename__ = "CategoryTopics"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("CourseCategories.id", ondelete="CASCADE"), nullable=False)
    name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    short_name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    description: MappedColumn[str] = mapped_column(TEXT, nullable=False)
    updated_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
    

    @classmethod
    async def Create(cls, db: DataBase, *, category_id: int, name: str, short_name: str, description: str) -> 'CategoryTopic':
        """
        Create a New Category Topic

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        category_id: :class:`int`
            The ID of the Category
        name: :class:`str`
            The Name of the Category Topic
        short_name: :class:`str`
            The Short Name of the Category Topic
        description: :class:`str`
            The Description of the Category Topic

        Returns
        -------
        :class:`CategoryTopic`
            The Category Topic
        """

        topic = cls(category_id=category_id, name=name, short_name=short_name, description=description)
        db.add(topic)
        await db.commit()
        await db.refresh(topic)
        return topic
    

    @staticmethod
    async def GetAll(db: DataBase, *, category_id: Optional[int] = None) -> list['CategoryTopic']:
        """
        Get All Category Topics

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        category_id: Optional[:class:`int`]
            The ID of the Category

        Returns
        -------
        List[:class:`CategoryTopic`]
            The Category Topics
        """

        result = await db.execute(select(CategoryTopic))
        return list(result.scalars().all())


    @staticmethod
    async def GetByID(db: DataBase, *, topic_id: Optional[int] = None) -> 'CategoryTopic | None':
        """
        Get a Category Topic by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        topic_id: Optional[:class:`int`]
            The ID of the Category Topic

        Raises
        ------
        ValueError
            The Required Argument is Missing

        Returns
        -------
        Optional[:class:`CategoryTopic`]
            The Category Topic
        """

        result = await db.execute(select(CategoryTopic).where(CategoryTopic.id == topic_id))
        return result.scalar() if result else None


    @staticmethod
    async def GetByName(db: DataBase, *, name: str) -> 'CategoryTopic | None':
        """
        Get a Category Topic by its Name

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        name: :class:`str`
            The Name of the Category Topic

        Returns
        -------
        Optional[:class:`CategoryTopic`]
            The Category Topic
        """

        result = await db.execute(select(CategoryTopic).where(CategoryTopic.name == name))
        return result.scalar() if result else None


    async def Update(self, db: DataBase) -> 'CategoryTopic':
        """
        Update the Category Topic

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`CategoryTopic`
            The Category Topic
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Category Topic

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
