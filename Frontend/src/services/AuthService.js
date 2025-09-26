import axios from 'axios';
import { api_auth } from '../api';
import { getUser, setUser, getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, clearAuthData } from '../utils/localStorage';

class AuthService {
  constructor() {
    this.accessToken = getAccessToken();
    this.refreshToken = getRefreshToken();
    this.user = getUser();
    
    console.log('AuthService constructor - Loaded from localStorage:');
    console.log('- accessToken:', this.accessToken);
    console.log('- refreshToken:', this.refreshToken);
    console.log('- user:', this.user);
    
    // Setup axios interceptor
    this.setupInterceptors();
    
    // If we have token but no user, try to load user from token
    if (this.accessToken && !this.user) {
      this.loadUserFromToken();
    }
  }

  // Setup axios interceptors for automatic token refresh
  setupInterceptors() {
    // Request interceptor to add access token
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.url?.includes('/classhub/')) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // If token expired and we haven't already tried to refresh
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            this.refreshToken &&
            originalRequest.url?.includes('/classhub/')) {
          
          originalRequest._retry = true;

          try {
            const newTokens = await this.refreshAccessToken();
            if (newTokens) {
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Login user
  async login(email, password) {
    try {
      const response = await axios.post(`${api_auth}/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        console.log('API Response data:', response.data.data);
        console.log('User object:', user);
        console.log('User admin property:', user?.admin);
        
        // Store tokens and user data
        this.setTokens(accessToken, refreshToken);
        this.setUser(user);
        
        // Clear admin redirect flag when logging in
        sessionStorage.removeItem('adminRedirected');
        
        const result = {
          success: true,
          user,
          admin: user?.admin || false
        };
        
        console.log('AuthService returning:', result);
        return result;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${api_auth}/refresh`, {
        refreshToken: this.refreshToken
      });

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        this.setTokens(accessToken, refreshToken);
        return { accessToken, refreshToken };
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.refreshToken) {
        await axios.post(`${api_auth}/logout`, {
          refreshToken: this.refreshToken
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAllAuthData();
    }
  }

  // Logout from all sessions
  async logoutAll() {
    try {
      if (this.refreshToken) {
        await axios.post(`${api_auth}/logout-all`, {
          refreshToken: this.refreshToken
        });
      }
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      this.clearAllAuthData();
    }
  }

  // Get active sessions
  async getSessions() {
    try {
      const response = await axios.get(`${api_auth}/sessions`);
      return response.data;
    } catch (error) {
      console.error('Get sessions error:', error);
      return { success: false, error: 'Failed to get sessions' };
    }
  }

  // Store tokens
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }

  // Store user data
  setUser(user) {
    console.log('AuthService.setUser() - Setting user:', user);
    this.user = user;
    setUser(user);
    console.log('AuthService.setUser() - User set, this.user is now:', this.user);
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Clear user data
  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

  // Clear all auth data
  clearAllAuthData() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    clearAuthData();
    // Clear admin redirect flag when logging out
    sessionStorage.removeItem('adminRedirected');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.accessToken && this.user);
  }

  // Load user from token
  async loadUserFromToken() {
    if (!this.accessToken) {
      console.log('AuthService.loadUserFromToken() - No access token');
      return null;
    }

    try {
      console.log('AuthService.loadUserFromToken() - Loading user from token...');
      const response = await axios.get(`${api_auth}/me`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });

      if (response.data && response.data.user) {
        this.user = response.data.user;
        setUser(this.user);
        console.log('AuthService.loadUserFromToken() - User loaded:', this.user);
        return this.user;
      }
    } catch (error) {
      console.error('AuthService.loadUserFromToken() - Error loading user:', error);
      // If token is invalid, clear auth data
      if (error.response?.status === 401) {
        this.logout();
      }
    }
    return null;
  }

  // Get current user
  getCurrentUser() {
    console.log('AuthService.getCurrentUser() - this.user:', this.user);
    return this.user;
  }

  // Get access token
  getAccessToken() {
    return this.accessToken;
  }

  // Get refresh token
  getRefreshToken() {
    return this.refreshToken;
  }

  // Check if user is admin
  isAdmin() {
    return this.user?.admin === true;
  }

  // Auto logout when access token expires (15 minutes)
  startTokenExpiryTimer() {
    // Clear existing timer
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }

    // Set new timer for 14 minutes (1 minute before expiry)
    this.tokenExpiryTimer = setTimeout(() => {
      console.log('Access token will expire soon, refreshing...');
      this.refreshAccessToken().catch(() => {
        console.log('Token refresh failed, logging out...');
        this.logout();
        window.location.href = '/login';
      });
    }, 14 * 60 * 1000); // 14 minutes
  }

  // Stop token expiry timer
  stopTokenExpiryTimer() {
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
      this.tokenExpiryTimer = null;
    }
  }

  // Forgot Password - Gửi email reset password
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${api_auth}/forgot-password`, {
        email
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      }
      
      throw new Error(response.data.message || 'Gửi email thất bại');
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      };
    }
  }

  // Verify Reset Token - Kiểm tra token reset password
  async verifyResetToken(token) {
    try {
      const response = await axios.get(`${api_auth}/verify-reset-token/${token}`);

      if (response.data.success) {
        return {
          success: true,
          email: response.data.email,
          message: response.data.message
        };
      }
      
      throw new Error(response.data.message || 'Token không hợp lệ');
    } catch (error) {
      console.error('Verify reset token error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn'
      };
    }
  }

  // Reset Password - Đặt lại mật khẩu mới
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${api_auth}/reset-password`, {
        token,
        newPassword
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      }
      
      throw new Error(response.data.message || 'Đặt lại mật khẩu thất bại');
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
