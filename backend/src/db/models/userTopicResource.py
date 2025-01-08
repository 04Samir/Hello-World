"""
The Model for the UserTopicResources Table
"""

from sqlalchemy import func, ForeignKey, Integer, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime
from typing import Optional

from ..connector import Base, AsyncSession as DataBase


class UserTopicResource(Base):
    """User Topic Resource Model"""

    __tablename__ = "UserTopicResources"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    resource_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("TopicResources.id", ondelete='CASCADE'), nullable=False)
    read_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, user_id: int, resource_id: int) -> 'UserTopicResource':
        """
        Create a New User Topic Resource

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        resource_id: :class:`int`
            The ID of the Topic Resource

        Returns
        -------
        :class:`UserTopicResource`
            The User Topic Resource
        """

        user_topic_resource = cls(user_id=user_id, resource_id=resource_id)
        db.add(user_topic_resource)
        await db.commit()
        await db.refresh(user_topic_resource)
        return user_topic_resource
    

    @staticmethod
    async def GetByID(db: DataBase, *, user_id: Optional[int] = None, resource_id: Optional[int] = None) -> 'UserTopicResource | list[UserTopicResource] | None':
        """
        Get a User Topic Resource by User ID & Topic Resource ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: Optional[:class:`int`]
            The ID of the User
        resource_id: Optional[:class:`int`]
            The ID of the Topic Resource

        Raises
        ------
        ValueError
            Missing Required Argument

        Returns
        -------
        :class:`UserTopicResource | None`
            The User Topic Resource
        """

        if user_id and resource_id:
            result = await db.execute(select(UserTopicResource).filter_by(user_id=user_id, resource_id=resource_id))
            return result.scalar() if result else None
        elif user_id:
            results = await db.execute(select(UserTopicResource).filter_by(user_id=user_id))
            return list(results.scalars().all())
        elif resource_id:
            results = await db.execute(select(UserTopicResource).filter_by(resource_id=resource_id))
            return list(results.scalars().all())
        else:
            raise ValueError("Missing Required Argument: 'user_id' or 'resource_id'")
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the User Topic Resource

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
