import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, logoutUser } from '../utils/storage';

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

    const logout = () => {
        logoutUser();
        setUser(null);
        window.location.href = '/'; // Hard redirect to clear any state if needed
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
