// Search service for global search API
import { apiRequest } from "./api";

/**
 * Search for users, communities, and posts
 * @param {string} query - The search query
 * @returns {Promise<object>} - { users: [], communities: [], posts: [] }
 */
export const globalSearch = async (query) => {
  if (!query || !query.trim()) return { users: [], communities: [], posts: [] };
  return apiRequest(`/search?q=${encodeURIComponent(query)}`);
};
