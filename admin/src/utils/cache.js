/**
 * Cache utility for storing and retrieving data with expiration
 * Uses localStorage for persistence across page refreshes
 */

const CACHE_PREFIX = "app_cache_";
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cache item by key
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getCache = (key) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (!cachedData) return null;

    const { data, timestamp, duration } = JSON.parse(cachedData);
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > duration) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error retrieving cache for key "${key}":`, error);
    return null;
  }
};

/**
 * Set cache item with expiration
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} duration - Cache duration in milliseconds (default: 5 minutes)
 */
export const setCache = (key, data, duration = DEFAULT_CACHE_DURATION) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cacheData = {
      data,
      timestamp: Date.now(),
      duration,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`Error setting cache for key "${key}":`, error);
  }
};

/**
 * Remove cache item by key
 * @param {string} key - Cache key
 */
export const removeCache = (key) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error(`Error removing cache for key "${key}":`, error);
  }
};

/**
 * Clear all cache items
 */
export const clearAllCache = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing all cache:", error);
  }
};

/**
 * Check if cache key exists and is valid
 * @param {string} key - Cache key
 * @returns {boolean}
 */
export const isCacheValid = (key) => {
  return getCache(key) !== null;
};

/**
 * Async function wrapper with caching
 * @param {string} key - Cache key
 * @param {function} asyncFn - Async function to execute if cache misses
 * @param {number} duration - Cache duration in milliseconds
 * @returns {Promise<any>} - Cached or fresh data
 */
export const withCache = async (key, asyncFn, duration = DEFAULT_CACHE_DURATION) => {
  // Check cache first
  const cachedData = getCache(key);
  if (cachedData !== null) {
    return cachedData;
  }

  // Cache miss - execute function and cache result
  const freshData = await asyncFn();
  setCache(key, freshData, duration);
  return freshData;
};
