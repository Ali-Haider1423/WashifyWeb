import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, logoutUser, loginUser } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = getSession();
        if (session) {
            setUser(session);
        }
        setLoading(false);
    }, []);

    const login = (email, password, role) => {
        const session = loginUser(email, password, role);
        setUser(session);
        return session;
    };

    const logout = () => {
        logoutUser();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
