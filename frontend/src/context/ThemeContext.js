/*
    The Theme Context
    -----------------
*/

import { createContext, useCallback, useContext, useEffect } from 'react';

import { useLocalStorage } from '../utilities';


const ThemeContext = createContext();


export const ThemeProvider = ({ children }) => {
    const getPreferredTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const [currentTheme, saveTheme] = useLocalStorage(
        'theme',
        getPreferredTheme()
    );

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    };

    const toggleTheme = useCallback(() => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        saveTheme(newTheme);
    }, [currentTheme, saveTheme]);

    useEffect(() => {
        setTheme(currentTheme);
    }, [currentTheme]);


    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
