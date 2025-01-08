"""
The Model for the UserNotifications Table
"""

from sqlalchemy import func, ForeignKey, Integer, String, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime

from ..connector import Base, AsyncSession as DataBase


class UserNotification(Base):
    """"User Notifications Model"""

    __tablename__ = "UserNotifications"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id"), nullable=False)
    title: MappedColumn[str] = mapped_column(String(100), nullable=False)
    content: MappedColumn[str] = mapped_column(String(255), nullable=False)
    notified_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, nullable=False, server_default=func.now())


    @classmethod
    async def Create(cls, db: DataBase, user_id: int, title: str, content: str) -> 'UserNotification':
        """
        
        Create a New User Notification

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The User ID
        title: :class:`str`
            The Notification Title
        content: :class:`str`
            The Notification Content

        Returns
        -------
        :class:`UserNotification`
            The Created Notification Object
        """

        notification = cls(user_id=user_id, title=title, content=content)
        db.add(notification)
        await db.commit()
        await db.refresh(notification)
        return notification


    @staticmethod
    async def GetByID(db: DataBase, id: int) -> 'UserNotification | None':
        """
        
        Get a Notification by ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        id: :class:`int`
            The Notification ID

        Returns
        -------
        :class:`UserNotification`
            The Notification Object
        """

        result = await db.execute(select(UserNotification).filter(UserNotification.id == id))
        return result.scalar() if result else None
    

    @staticmethod
    async def GetAllByUserID(db: DataBase, user_id: int) -> 'list[UserNotification]':
        """
        
        Get All Notifications for a User

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The User ID

        Returns
        -------
        :class:`list[UserNotification]`
            The List of Notifications
        """

        results = await db.execute(select(UserNotification).filter(UserNotification.user_id == user_id))
        return list(results.scalars().all())


    async def Update(self, db: DataBase) -> 'UserNotification':
        """
        Update the User Notification

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`UserNotification`
            The Updated Notification Object
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the User Notification

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
