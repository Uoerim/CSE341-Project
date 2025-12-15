/**
 * Application Configuration
 * Environment-specific settings and constants
 */

const CONFIG = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 10000,
  },

  // Authentication Configuration
  auth: {
    tokenKey: "authToken",
    tokenExpiryKey: "authTokenExpiry",
    redirectOnLogin: "/app",
    redirectOnLogout: "/",
  },

  // Validation Rules
  validation: {
    username: {
      minLength: 4,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_-]+$/,
    },
    password: {
      minLength: 12,
      requireUppercase: false,
      requireLowercase: true,
      requireNumbers: false,
      requireSpecialChar: true,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },

  // API Endpoints (relative to baseURL)
  endpoints: {
    auth: {
      register: "/auth/register",
      login: "/auth/login",
      logout: "/auth/logout",
      checkUsername: "/auth/check-username",
      checkEmail: "/auth/check-email",
      verify: "/auth/verify",
    },
    user: {
      profile: "/user/profile",
      getUserByUsername: "/user/:username",
    },
  },
};

export default CONFIG;
