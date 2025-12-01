/**
 * Token Service
 * Handles token storage and management
 */

const TOKEN_KEY = "authToken";

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  if (!token) {
    console.warn("setToken: Attempted to set empty token");
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve authentication token from localStorage
 * @returns {string|null} - Stored token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (token exists)
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Clear all authentication data
 */
export const logout = () => {
  removeToken();
};
