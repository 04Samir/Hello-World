/*
    The Log-Out Page
    --------------
*/

import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context';


export const LogOut = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const handleLogout = async () => {
            if (!user) {
                navigate('/');
                return;
            }
            await logout();
        };
        handleLogout();
    }, [user, logout, navigate]);

    useLayoutEffect(() => {
        document.title = 'Log-Out | Hello World';
    }, []);

    return null;
};
