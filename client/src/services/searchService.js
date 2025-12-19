// Search Service
// Handles search-related API calls
import { apiRequest } from "./api";

/**
 * Search users, communities, and posts
 * @param {string} query - Search query
 * @returns {Promise<object>} - { users: [], communities: [], posts: [] }
 */
export const globalSearch = async (query) => {
  if (!query || !query.trim()) return { users: [], communities: [], posts: [] };
  return apiRequest(`/search?q=${encodeURIComponent(query)}`);
};
