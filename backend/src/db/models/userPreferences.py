"""
The Model for the UserPreferences Table
"""

from sqlalchemy import Boolean, ForeignKey, Integer
from sqlalchemy.orm import mapped_column, MappedColumn
from sqlalchemy.sql.expression import select

from ..connector import Base, AsyncSession as DataBase


class UserPreference(Base):
    """"User Preferences Model"""

    __tablename__ = "UserPreferences"

    id: MappedColumn[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: MappedColumn[int] = mapped_column(Integer, ForeignKey("Users.id"), nullable=False, unique=True)
    daily_quiz_reminder: MappedColumn[bool] = mapped_column(Boolean, default=True, nullable=False)
    weekly_newsletter: MappedColumn[bool] = mapped_column(Boolean, default=True, nullable=False)


    @classmethod
    async def Create(cls, db: DataBase, user_id: int, daily_quiz_reminder: bool = True, weekly_newsletter: bool = True) -> 'UserPreference':
        """
        
        Create a New User Preference

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The User ID
        daily_quiz_reminder: :class:`bool`
            The Daily Quiz Reminder
        weekly_newsletter: :class:`bool`
            The Weekly Newsletter

        Returns
        -------
        :class:`UserPreference`
            The Created Preference Object
        """

        preference = cls(user_id=user_id, daily_quiz_reminder=daily_quiz_reminder, weekly_newsletter=weekly_newsletter)
        db.add(preference)
        await db.commit()
        await db.refresh(preference)
        return preference
    

    @staticmethod
    async def GetByID(db: DataBase, id: int) -> 'UserPreference | None':
        """
        
        Get a Preference by ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        id: :class:`int`
            The Preference ID

        Returns
        -------
        :class:`UserPreference`
            The Preference Object
        """

        result = await db.execute(select(UserPreference).filter(UserPreference.id == id))
        return result.scalar() if result else None
    

    @staticmethod
    async def GetByUserID(db: DataBase, user_id: int) -> 'UserPreference':
        """
        
        Get a Preference by User ID

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session
        user_id: :class:`int`
            The User ID

        Returns
        -------
        :class:`UserPreference`
            The Preference Object
        """

        result = await db.execute(select(UserPreference).filter(UserPreference.user_id == user_id))
        return result.scalar()
    

    async def Update(self, db: DataBase) -> 'UserPreference':
        """
        Update the User Preference

        Parameters
        ----------
        db: :class:`DataBase`
            The Database Session

        Returns
        -------
        :class:`UserPreference`
            The Updated Preference Object
        """

        await db.commit()
        await db.refresh(self)
        return self
    

    async def Delete(self, db: DataBase) -> bool:
        """
        Delete the User Preference

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
