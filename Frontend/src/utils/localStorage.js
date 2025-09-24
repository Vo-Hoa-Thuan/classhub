/**
 * Utility functions for safe localStorage operations
 */

/**
 * Safely get and parse JSON data from localStorage
 * @param {string} key - localStorage key
 * @param {*} defaultValue - default value if key doesn't exist or parsing fails
 * @returns {*} parsed data or default value
 */
export const safeGetJSON = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    // Check for null, undefined, or string "undefined"/"null"
    if (data === null || data === undefined || data === 'undefined' || data === 'null' || data === '') {
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set JSON data to localStorage
 * @param {string} key - localStorage key
 * @param {*} value - value to store
 * @returns {boolean} success status
 */
export const safeSetJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting JSON to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Safely get user data from localStorage
 * @returns {Object|null} user object or null
 */
export const getUser = () => {
  return safeGetJSON('user', null);
};

/**
 * Safely set user data to localStorage
 * @param {Object} user - user object
 * @returns {boolean} success status
 */
export const setUser = (user) => {
  return safeSetJSON('user', user);
};

/**
 * Safely get access token from localStorage
 * @returns {string|null} access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Safely set access token to localStorage
 * @param {string} token - access token
 * @returns {boolean} success status
 */
export const setAccessToken = (token) => {
  try {
    localStorage.setItem('accessToken', token);
    return true;
  } catch (error) {
    console.error('Error setting access token:', error);
    return false;
  }
};

/**
 * Safely get refresh token from localStorage
 * @returns {string|null} refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Safely set refresh token to localStorage
 * @param {string} token - refresh token
 * @returns {boolean} success status
 */
export const setRefreshToken = (token) => {
  try {
    localStorage.setItem('refreshToken', token);
    return true;
  } catch (error) {
    console.error('Error setting refresh token:', error);
    return false;
  }
};

/**
 * Clear all auth-related data from localStorage
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};
