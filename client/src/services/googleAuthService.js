/**
 * Google Authentication Service
 * Handles Google Sign-In authentication flows
 */

import { apiRequest } from "./api";

/**
 * Authenticate with Google ID Token
 * @param {string} idToken - Google ID Token from client
 * @returns {Promise<object>} - User data or registration flow data
 */
export const googleAuthenticate = async (idToken) => {
  try {
    const response = await apiRequest("/auth/google-auth", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Google authentication failed");
  }
};

/**
 * Complete Google registration with username
 * @param {string} idToken - Google ID Token
 * @param {string} username - Username for the new account
 * @param {string} gender - User's gender preference
 * @returns {Promise<object>} - User data and authentication token
 */
export const completeGoogleRegistration = async (idToken, username, gender = "prefer not to say") => {
  try {
    const response = await apiRequest("/auth/google-register", {
      method: "POST",
      body: JSON.stringify({ idToken, username, gender }),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Google registration failed");
  }
};
