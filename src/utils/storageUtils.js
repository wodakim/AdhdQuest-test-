/**
 * Utility functions for interacting with localStorage
 */

// Save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving data to localStorage with key ${key}:`, error);
  }
};

// Get data from localStorage
export const getFromStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error(`Error getting data from localStorage with key ${key}:`, error);
    return null;
  }
};

// Remove data from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from localStorage with key ${key}:`, error);
  }
};

// Clear all app data from localStorage
export const clearAllAppData = () => {
  try {
    // Only remove keys that start with our app prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('adhd-quest-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all app data from localStorage:', error);
  }
};

// Check if localStorage is available
export const isStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};