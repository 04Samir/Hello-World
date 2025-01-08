"""
The Model for the Sessions Table
"""

from sqlalchemy import func, ForeignKey, Integer, String, DATETIME, TEXT, TIMESTAMP
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from datetime import datetime

from ..connector import Base, AsyncSession as DataBase


class Session(Base):
    """Session Model"""
    
    __tablename__ = "Sessions"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id", ondelete="CASCADE"))
    token: MappedColumn[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    location: MappedColumn[str] = mapped_column(String(255), nullable=False)
    device: MappedColumn[str] = mapped_column(String(255), nullable=False)
    expires_at: MappedColumn[datetime] = mapped_column(DATETIME, nullable=False)
    last_active: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at: MappedColumn[datetime] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, *, user_id: int, token: str, location: str, device: str, expires_at: datetime) -> 'Session':
        """
        Create a New Session

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The ID of the User
        token: :class:`str`
            The Session Token
        location: :class:`str`
            The Location of the User
        device: :class:`str`
            The Device of the User
        expires_at: :class:`datetime.datetime
            The Expiry Date

        Returns
        -------
        :class:`Session`
            The Session
        """

        session = cls(user_id=user_id, token=token, location=location, device=device, expires_at=expires_at)
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session
    

    @staticmethod
    async def GetAllByUserID(db: DataBase, user_id: int) -> list['Session']:
        """
        Get all Sessions by the User ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The User ID

        Returns
        -------
        List[:class:`Session`]
            The Sessions
        """

        results = await db.execute(select(Session).where(Session.user_id == user_id))
        return list(results.scalars().all())


    @staticmethod
    async def GetByToken(db: DataBase, token: str) -> 'Session | None':
        """
        Get a Session by its Token

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        token: :class:`str`
            The Session Token

        Returns
        -------
        Optional[:class:`Session`]
            The Session
        """

        result = await db.execute(select(Session).where(Session.token == token))
        return result.scalar() if result else None


    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the Session

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
