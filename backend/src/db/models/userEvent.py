"""
The Model for the UserEvents Table
"""

from sqlalchemy import func, ForeignKey, Integer, String, DATETIME, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime

from ..connector import Base, AsyncSession as DataBase


class UserEvent(Base):
    """"User Event Model"""

    __tablename__ = "UserEvents"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    title: MappedColumn[str] = mapped_column(String(100), nullable=False)
    content: MappedColumn[str] = mapped_column(String(255), nullable=False)
    start_date: MappedColumn[datetime] = mapped_column(DATETIME, nullable=False)
    end_date: MappedColumn[datetime] = mapped_column(DATETIME, nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, user_id: int, title: str, content: str, start_date: datetime, end_date: datetime) -> 'UserEvent':
        """
        Create a New User Event

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        title: :class:`str`
            The Title of the Event
        content: :class:`str`
            The Content of the Event
        start_date: :class:`datetime.datetime`
            The Start Date of the Event
        end_date: :class:`datetime.datetime`
            The End Date of the Event

        Returns
        -------
        :class:`UserEvent`
            The User Event
        """

        user_event = cls(user_id=user_id, title=title, content=content, start_date=start_date, end_date=end_date)
        db.add(user_event)
        await db.commit()
        await db.refresh(user_event)
        return user_event
    

    @staticmethod
    async def GetAllByUserID(db: DataBase, *, user_id: int) -> list['UserEvent']:
        """
        Get All User Events by User ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User

        Returns
        -------
        list[:class:`UserEvent`]
            The User Events
        """

        results = await db.execute(select(UserEvent).where(UserEvent.user_id == user_id))
        return list(results.scalars().all())
    

    @staticmethod
    async def GetByID(db: DataBase, *, id: int) -> 'UserEvent | None':
        """
        Get a User Event by its ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        id: :class:`int`
            The ID of the User Event

        Returns
        -------
        Optional[:class:`UserEvent`]
            The User Event
        """

        result = await db.execute(select(UserEvent).where(UserEvent.id == id))
        return result.scalar() if result else None
    

    async def Update(self, db: DataBase) -> 'UserEvent':
        """
        Update the User Event

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`UserEvent`
            The User Event
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the User Event

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
