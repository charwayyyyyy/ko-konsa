/**
 * Utility functions for handling offline functionality
 * This module provides tools for managing online/offline state,
 * storing data for offline use, and synchronizing when back online.
 */

/**
 * Check if the application is online
 * @returns {boolean} True if online, false if offline
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Register event listeners for online/offline status
 * @param {Function} onlineCallback - Function to call when app goes online
 * @param {Function} offlineCallback - Function to call when app goes offline
 * @returns {Function} Cleanup function to remove event listeners
 */
export const registerConnectivityListeners = (onlineCallback, offlineCallback) => {
  // Handle browser online/offline events
  const handleOnline = () => {
    onlineCallback();
    notifyServiceWorker(true);
  };
  
  const handleOffline = () => {
    offlineCallback();
    notifyServiceWorker(false);
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Listen for messages from service worker
  navigator.serviceWorker?.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CONNECTIVITY_STATUS') {
      if (event.data.isOnline) {
        onlineCallback();
      } else {
        offlineCallback();
      }
    }
  });
  
  // Initial notification to service worker
  notifyServiceWorker(navigator.onLine);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    navigator.serviceWorker?.removeEventListener('message', handleOnline);
  };
};

/**
 * Notify the service worker about connectivity changes
 * @param {boolean} isOnline - Current online status
 */
const notifyServiceWorker = (isOnline) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CONNECTIVITY_CHANGE',
      isOnline
    });
  }
};

/**
 * Store data in IndexedDB for offline use
 * @param {string} storeName - Name of the store
 * @param {Object} data - Data to store
 * @returns {Promise} Promise that resolves when data is stored
 */
export const storeOfflineData = async (storeName, data) => {
  // This is a simplified implementation
  // In a real app, you would use IndexedDB or another storage mechanism
  try {
    localStorage.setItem(`kokonsa_offline_${storeName}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to store offline data:', error);
    return false;
  }
};

/**
 * Retrieve data stored for offline use
 * @param {string} storeName - Name of the store
 * @returns {Object|null} The stored data or null if not found
 */
export const getOfflineData = (storeName) => {
  try {
    const data = localStorage.getItem(`kokonsa_offline_${storeName}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve offline data:', error);
    return null;
  }
};

/**
 * Queue actions to be performed when back online
 * @param {Object} action - The action to queue
 */
export const queueAction = (action) => {
  try {
    const queue = getActionQueue();
    queue.push({
      ...action,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('kokonsa_action_queue', JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to queue action:', error);
  }
};

/**
 * Get the current action queue
 * @returns {Array} Array of queued actions
 */
export const getActionQueue = () => {
  try {
    const queue = localStorage.getItem('kokonsa_action_queue');
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Failed to get action queue:', error);
    return [];
  }
};

/**
 * Process queued actions when back online
 * @param {Function} processFunction - Function to process each action
 * @param {boolean} retryFailed - Whether to retry previously failed actions
 * @returns {Promise<Array>} Results of processing the queue
 */
export const processActionQueue = async (processFunction, retryFailed = true) => {
  if (!isOnline()) return [];
  
  try {
    const queue = getActionQueue();
    if (queue.length === 0) return [];
    
    // Process each action
    const results = [];
    for (const action of queue) {
      // Skip failed actions if not retrying
      if (!retryFailed && action.failedAttempts && action.failedAttempts > 0) {
        results.push({ action, success: false, skipped: true });
        continue;
      }
      
      try {
        const result = await processFunction(action);
        results.push({ action, success: true, result });
      } catch (error) {
        // Increment failed attempts
        action.failedAttempts = (action.failedAttempts || 0) + 1;
        action.lastError = error.message;
        results.push({ action, success: false, error: error.message });
      }
    }
    
    // Remove successful actions from queue, keep failed ones
    const newQueue = queue.filter((action, index) => !results[index].success);
    localStorage.setItem('kokonsa_action_queue', JSON.stringify(newQueue));
    
    return results;
  } catch (error) {
    console.error('Failed to process action queue:', error);
    return [];
  }
};

/**
 * Check if the app has pending offline actions
 * @returns {boolean} True if there are pending actions
 */
export const hasPendingActions = () => {
  const queue = getActionQueue();
  return queue.length > 0;
};

/**
 * Clear all pending offline actions
 * @returns {boolean} True if successful
 */
export const clearActionQueue = () => {
  try {
    localStorage.removeItem('kokonsa_action_queue');
    return true;
  } catch (error) {
    console.error('Failed to clear action queue:', error);
    return false;
  }
};