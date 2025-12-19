// Trending posts service
import { apiRequest } from "./api";

/**
 * Get trending posts (most liked)
 * @returns {Promise<object>} - { trending: [ ...posts ] }
 */
export const getTrendingPosts = async () => {
  return apiRequest("/search/trending");
};
