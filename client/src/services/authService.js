/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiRequest } from "./api";

/**
 * Register a new user
 * @param {object} userData - User registration data (email, username, password, gender)
 * @returns {Promise<object>} - User data and authentication token
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

/**
 * Login user with email or username
 * @param {string} emailOrUsername - User email or username
 * @param {string} password - User password
 * @returns {Promise<object>} - User data and authentication token
 */
export const loginUser = async (emailOrUsername, password) => {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ emailOrUsername, password }),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

/**
 * Check if username is available
 * @param {string} username - Username to check
 * @returns {Promise<object>} - { exists: boolean }
 */
export const checkUsername = async (username) => {
  try {
    const response = await apiRequest("/auth/check-username", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Username check failed");
  }
};

/**
 * Check if email is available
 * @param {string} email - Email to check
 * @returns {Promise<object>} - { exists: boolean }
 */
export const checkEmail = async (email) => {
  try {
    const response = await apiRequest("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Email check failed");
  }
};

/**
 * Verify authentication token
 * @param {string} token - JWT token to verify
 * @returns {Promise<boolean>} - Token validity
 */
export const verifyToken = async (token) => {
  try {
    const response = await apiRequest("/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.valid === true;
  } catch (error) {
    return false;
  }
};

export const phoneAuthenticate = async (firebaseIdToken) => {
  try {
    const response = await apiRequest("/auth/phone-auth", {
      method: "POST",
      body: JSON.stringify({ firebaseIdToken }),
    });
    return response; // { _id, username, phone, email, token, isNewUser, needsProfile }
  } catch (error) {
    throw new Error(error.message || "Phone authentication failed");
  }
};