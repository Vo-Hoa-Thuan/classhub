import axios from 'axios';
import { api_auth } from '../api';

class TokenInterceptor {
    constructor() {
        this.isRefreshing = false;
        this.failedQueue = [];
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor để thêm access token
        axios.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor để xử lý token hết hạn
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Nếu lỗi 401 và chưa retry
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // Nếu đang refresh, thêm request vào queue
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return axios(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }

                        const response = await axios.post(`${api_auth}/refresh`, {
                            refreshToken: refreshToken
                        });

                        const { accessToken } = response.data.data;
                        localStorage.setItem('accessToken', accessToken);

                        // Process queued requests
                        this.processQueue(null, accessToken);

                        // Retry original request
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axios(originalRequest);

                    } catch (refreshError) {
                        // Refresh failed, redirect to login
                        this.processQueue(refreshError, null);
                        this.clearTokens();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    processQueue(error, token = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
        
        this.failedQueue = [];
    }

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    // Method để set tokens sau khi login
    setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    // Method để logout
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await axios.post(`${api_auth}/logout`, {
                    refreshToken: refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    }

    // Method để logout tất cả sessions
    async logoutAllSessions() {
        try {
            await axios.post(`${api_auth}/logout-all`);
            this.clearTokens();
        } catch (error) {
            console.error('Logout all sessions error:', error);
        }
    }

    // Method để lấy danh sách sessions
    async getUserSessions() {
        try {
            const response = await axios.get(`${api_auth}/sessions`);
            return response.data.data;
        } catch (error) {
            console.error('Get sessions error:', error);
            return [];
        }
    }
}

// Export singleton instance
const tokenInterceptor = new TokenInterceptor();
export default tokenInterceptor;
