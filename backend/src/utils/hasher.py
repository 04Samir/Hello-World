"""
Password Hasher
"""

import argon2


class Hasher:
    """Hasher Class"""

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash the Password

        Parameters
        ----------
        password: :class:`str`
            The Password

        Returns
        -------
        :class:`str`
            The Hashed Password
        """

        return argon2.hash_password(password.encode()).decode()


    @staticmethod
    def verify_password(hashed: str, password: str) -> bool:
        """
        Verify the Password

        Parameters
        ----------
        hashed: :class:`str`
            The Hashed Password
        password: :class:`str`
            The Password

        Returns
        -------
        :class:`bool`
            Whether the Password is Correct
        """

        try:
            return argon2.verify_password(hashed.encode(), password.encode())
        except argon2.exceptions.VerifyMismatchError:
            return False
