/*
    The Auth Route
    --------------
*/

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { useAuth } from '../context';


export const AuthenticatedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to={`/log-in?redirect=${location.pathname}`} />;
    };

    return children;
};
