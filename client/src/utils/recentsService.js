const STORAGE_KEY = 'loopifyRecentItems';
const MAX_RECENTS = 10;

/**
 * Get all recent items from localStorage
 * @returns {Array} Array of recent items
 */
export const getRecentItems = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to get recent items:', error);
        return [];
    }
};

/**
 * Add a community to recent items
 * @param {Object} community - The community object with _id, name, icon
 */
export const addRecentCommunity = (community) => {
    if (!community || !community.name) return;

    const item = {
        type: 'community',
        id: community._id,
        name: community.name,
        icon: community.icon || null,
        timestamp: Date.now()
    };

    addRecentItem(item);
};

/**
 * Add a profile to recent items
 * @param {Object} user - The user object with _id, username, avatar
 */
export const addRecentProfile = (user) => {
    if (!user || !user.username) return;

    const item = {
        type: 'profile',
        id: user._id,
        username: user.username,
        avatar: user.avatar || 'char',
        timestamp: Date.now()
    };

    addRecentItem(item);
};

/**
 * Add an item to recent items list
 * @param {Object} item - The item to add
 */
const addRecentItem = (item) => {
    try {
        let recents = getRecentItems();

        // Remove duplicate if exists (same type and id/name/username)
        recents = recents.filter(r => {
            if (r.type !== item.type) return true;
            if (item.type === 'community') return r.name !== item.name;
            if (item.type === 'profile') return r.username !== item.username;
            return true;
        });

        // Add new item at the beginning
        recents.unshift(item);

        // Limit to MAX_RECENTS items
        recents = recents.slice(0, MAX_RECENTS);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));

        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('loopifyRecentsUpdated'));
    } catch (error) {
        console.error('Failed to add recent item:', error);
    }
};

/**
 * Clear all recent items
 */
export const clearRecentItems = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('loopifyRecentsUpdated'));
    } catch (error) {
        console.error('Failed to clear recent items:', error);
    }
};

export default {
    getRecentItems,
    addRecentCommunity,
    addRecentProfile,
    clearRecentItems
};
