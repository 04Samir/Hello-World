"""
The DataBase Connector
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os

from typing import AsyncGenerator, Any


def get_db_url() -> str:
    """
    Get the DataBase URL

    Returns
    -------
    :class:`str`
        The DataBase URL
    """

    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_NAME = os.getenv("DB_NAME")

    return f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"


class Base(declarative_base()):
    """Dict-ORM Base"""

    __abstract__ = True


    def as_dict(self, *, ignore: list[str] = []) -> dict[str, Any]:
        """
        Convert the Model to a Dictionary

        Parameters
        ----------
        ignore: :class:`list[str]`
            The Columns to Ignore

        Returns
        -------
        :class:`dict[str, Any]`
            The Model as a Dictionary
        """

        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
            if column.name not in ignore
        }


AsyncSessionLocal = async_sessionmaker(
    bind=create_async_engine(
        url=get_db_url(),
    ),
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Get the DataBase Session

    Returns
    -------
    :class:`AsyncSession`
        The DataBase Session
    """

    async with AsyncSessionLocal() as session:
        yield session
 
