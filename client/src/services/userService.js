/**
 * User Service
 * Handles user-related API calls
 */

import { apiRequest } from "./api";
import { getToken } from "./tokenService";

/**
 * Get current user profile
 * @returns {Promise<object>} - User profile data
 */
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await apiRequest("/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user profile");
  }
};

/**
 * Update user profile
 * @param {object} userData - User data to update
 * @returns {Promise<object>} - Updated user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await apiRequest("/user/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update user profile");
  }
};

/**
 * Get user by username
 * @param {string} username - Username to fetch
 * @returns {Promise<object>} - User public profile
 */
export const getUserByUsername = async (username) => {
  try {
    const response = await apiRequest(`/user/${username}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
};
