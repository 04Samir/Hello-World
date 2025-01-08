/*
    The Local Storage Hook
    ----------------------
*/

import { useState } from 'react';


export const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                if (defaultValue !== null) {
                    localStorage.setItem(keyName, JSON.stringify(defaultValue));
                };
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });

    const setValue = (newValue) => {
        try {
            if (newValue === null) {
                localStorage.removeItem(keyName);
            } else {
                localStorage.setItem(keyName, JSON.stringify(newValue));
            };
        } catch (error) {
            console.error(error);
        }
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
};
