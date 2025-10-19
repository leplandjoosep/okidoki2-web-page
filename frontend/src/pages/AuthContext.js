import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const logIn = (token) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
    };

    const logOut = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.href = './store';
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
