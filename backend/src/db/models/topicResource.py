"""
The Model for the TopicResources Table
"""

from sqlalchemy import func, ForeignKey, Integer, String, JSON, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class TopicResource(Base):
    """Topic Resource Model"""

    __tablename__ = "TopicResources"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    topic_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("CategoryTopics.id", ondelete="CASCADE"), nullable=False, unique=True)
    name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    short_name: MappedColumn[str] = mapped_column(String(30), nullable=False)
    content: MappedColumn[str] = mapped_column(JSON, nullable=False)
    updated_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, topic_id: int, name: str, short_name: str, content: dict) -> 'TopicResource':
        """
        Create a New Topic Resource

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        topic_id: :class:`int`
            The ID of the Topic
        name: :class:`str`
            The Name of the Topic Resource
        short_name: :class:`str`
            The Short Name of the Topic Resource
        content: :class:`dict`
            The Content of the Topic Resource

        Returns
        -------
        :class:`TopicResource`
            The Topic Resource
        """

        resource = cls(topic_id=topic_id, name=name, short_name=short_name, content=content)
        db.add(resource)
        await db.commit()
        await db.refresh(resource)
        return resource


    @staticmethod
    async def GetAll(db: DataBase) -> list['TopicResource']:
        """
        Get All Topic Resources

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        List[:class:`TopicResource`]
            The Topic Resources
        """

        result = await db.execute(select(TopicResource))
        return list(result.scalars().all())


    @staticmethod
    async def GetByID(db: DataBase, *, resource_id: Optional[int] = None, topic_id: Optional[int] = None) -> 'TopicResource | None':
        """
        Get a Topic Resource by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        resource_id: Optional[:class:`int`]
            The ID of the Topic Resource
        topic_id: Optional[:class:`int`]
            The ID of the Topic

        Raises
        ------
        ValueError
            Missing Required Argument

        Returns
        -------
        Optional[:class:`TopicResource`]
            The Topic Resource
        """

        if resource_id:
            result = await db.execute(select(TopicResource).where(TopicResource.id == resource_id))
        elif topic_id:
            result = await db.execute(select(TopicResource).where(TopicResource.topic_id == topic_id))
        else:
            raise ValueError("Missing Required Argument: 'resource_id' or 'topic_id'")
        
        return result.scalar() if result else None


    @staticmethod
    async def GetByName(db: DataBase, *, name: str) -> 'TopicResource | None':
        """
        Get a Topic Resource by its Name

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        name: :class:`str`
            The Name of the Topic Resource

        Returns
        -------
        Optional[:class:`TopicResource`]
            The Topic Resource
        """

        result = await db.execute(select(TopicResource).where(TopicResource.name == name))
        return result.scalar() if result else None


    async def Update(self, db: DataBase) -> 'TopicResource':
        """
        Update the Topic Resource

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`TopicResource`
            The Topic Resource
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Topic Resource

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
