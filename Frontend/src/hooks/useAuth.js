import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import axios from 'axios';
import tokenInterceptor from '../services/tokenInterceptor';
import { api_auth } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);

    const checkAuthStatus = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setLoading(false);
                return;
            }

            const response = await axios.get(`${api_auth}/me`);
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                // Cập nhật localStorage với thông tin user mới nhất
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                clearAuth();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, []);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${api_auth}/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { accessToken, refreshToken, ...userData } = response.data.data;
                
                // Set tokens using interceptor
                tokenInterceptor.setTokens(accessToken, refreshToken);
                
                setUser(userData);
                // Cập nhật localStorage với thông tin user mới
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, data: userData };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post(`${api_auth}/register`, userData);

            if (response.data.success) {
                return { success: true, data: response.data.data };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await tokenInterceptor.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
        }
    };

    const logoutAllSessions = async () => {
        try {
            await tokenInterceptor.logoutAllSessions();
            clearAuth();
        } catch (error) {
            console.error('Logout all sessions error:', error);
        }
    };

    const clearAuth = () => {
        setUser(null);
        setSessions([]);
        tokenInterceptor.clearTokens();
    };

    const getUserSessions = async () => {
        try {
            const sessions = await tokenInterceptor.getUserSessions();
            setSessions(sessions);
            return sessions;
        } catch (error) {
            console.error('Get sessions error:', error);
            return [];
        }
    };

    const refreshUserData = async () => {
        try {
            const response = await axios.get(`${api_auth}/me`);
            if (response.data.success) {
                setUser(response.data.user);
                return response.data.user;
            }
        } catch (error) {
            console.error('Refresh user data error:', error);
        }
    };

    const value = {
        user,
        loading,
        sessions,
        login,
        register,
        logout,
        logoutAllSessions,
        getUserSessions,
        refreshUserData,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
