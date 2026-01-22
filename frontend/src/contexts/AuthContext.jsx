import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../config/axios'; 

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            // No need for `${API_URL}/auth/me` because 'api' has the baseURL set
            const response = await api.get('/auth/me');
            setUser(response.data.user);
            setProfile(response.data.profile);
        } catch (error) {
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = useCallback(async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            setProfile(response.data.profile);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            setProfile(null);
        }
    }, []);

    const updatePreferences = useCallback(async (preferences) => {
        try {
            const response = await api.put('/auth/preferences', preferences);
            setUser(prev => ({ ...prev, preferences: response.data.preferences }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    }, []);

    const value = useMemo(() => ({
        user,
        profile,
        loading,
        login,
        logout,
        updatePreferences,
        fetchUser
    }), [user, profile, loading, login, logout, updatePreferences, fetchUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};