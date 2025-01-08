/*
    The Auth Context
    ----------------
*/

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import { useLocalStorage, Fetch } from '../utilities';


const AuthContext = createContext();


export const useAuth = () => {
    return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', null);
    const [user, setUser] = useLocalStorage('user', null);

    const fetchUser = async (token) => {
        const data = await Fetch('GET', '/@me', {
            'Authorization': `Bearer ${token}`
        });
        return data;
    };

    const removeUser = async (token) => {
        const data = await Fetch('POST', '/log-out', {
            'Authorization': `Bearer ${token}`
        });
        return data?.code === 200;
    };

    const login = useCallback(async (token) => {
        try {
            const data = await fetchUser(token);
            if (!data) {
                throw new Error('Invalid Token');
            };
            setToken(token);
            setUser(data.user);
        } catch (error) {
            console.error('Log-In Error:', error);
            setToken(null);
            setUser(null);
            throw new Error('Log-In Failed');
        };
    }, [setToken, setUser]);

    const logout = useCallback(async () => {
        try {
            await removeUser(token);
        } finally {
            setToken(null);
            setUser(null);
        };
    }, [token, setToken, setUser]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (token) {
                login(token);
            };
        }, 60000);

        return () => clearInterval(interval);
    }, [token, login]);

    const values = useMemo(() => ({
        user,
        token,
        login,
        logout,
    }), [user, token, login, logout]);

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};
