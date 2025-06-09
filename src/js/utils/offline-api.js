// Offline-capable API wrapper for Anevia
import pwaManager from './pwa.js';

class OfflineAPI {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingRequests = [];
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async makeRequest(url, options = {}, cacheKey = null) {
    // Try to make the request if online
    if (this.isOnline) {
      try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Cache successful responses
        if (cacheKey && response.ok) {
          await this.cacheResponse(cacheKey, data);
        }

        return data;
      } catch (error) {
        console.error('Network request failed:', error);
        // Fall back to cache if available
        if (cacheKey) {
          const cachedData = await this.getCachedResponse(cacheKey);
          if (cachedData) {
            console.log('Returning cached data due to network error');
            return cachedData;
          }
        }
        throw error;
      }
    } else {
      // Offline: try to get from cache
      if (cacheKey) {
        const cachedData = await this.getCachedResponse(cacheKey);
        if (cachedData) {
          console.log('Returning cached data (offline)');
          return cachedData;
        }
      }

      // Queue the request for when we're back online
      if (options.method && options.method !== 'GET') {
        this.queueRequest(url, options, cacheKey);
      }

      throw new Error('No internet connection and no cached data available');
    }
  }

  async cacheResponse(key, data) {
    if (pwaManager) {
      await pwaManager.cacheUserData(key, {
        data: data,
        timestamp: Date.now(),
        url: key
      });
    }
  }

  async getCachedResponse(key) {
    if (pwaManager) {
      const cached = await pwaManager.getCachedUserData(key);
      if (cached && cached.data) {
        // Check if cache is still valid (24 hours)
        const isValid = (Date.now() - cached.timestamp) < (24 * 60 * 60 * 1000);
        if (isValid) {
          return cached.data;
        }
      }
    }
    return null;
  }

  queueRequest(url, options, cacheKey) {
    this.pendingRequests.push({ url, options, cacheKey, timestamp: Date.now() });
    console.log('Request queued for when online:', url);
  }

  async processPendingRequests() {
    console.log(`Processing ${this.pendingRequests.length} pending requests`);

    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    for (const request of requests) {
      try {
        await this.makeRequest(request.url, request.options, request.cacheKey);
        console.log('Pending request processed successfully:', request.url);
      } catch (error) {
        console.error('Failed to process pending request:', request.url, error);
        // Re-queue if it's still recent (within 1 hour)
        if ((Date.now() - request.timestamp) < (60 * 60 * 1000)) {
          this.pendingRequests.push(request);
        }
      }
    }
  }

  // Scan-specific methods
  async uploadScanImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('firebaseToken');
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    };

    return await this.makeRequest(
      'https://server.anevia.my.id/api/scans',
      options,
      null // Don't cache upload requests
    );
  }

  async getAllScans() {
    const token = localStorage.getItem('firebaseToken');
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    return await this.makeRequest(
      'https://server.anevia.my.id/api/scans',
      options,
      'all-scans'
    );
  }

  async getScanById(scanId) {
    const token = localStorage.getItem('firebaseToken');
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    return await this.makeRequest(
      `https://server.anevia.my.id/api/scans/${scanId}`,
      options,
      `scan-${scanId}`
    );
  }

  // User profile methods
  async getUserProfile(uid) {
    const token = localStorage.getItem('firebaseToken');
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    return await this.makeRequest(
      `https://server.anevia.my.id/auth/profile/${uid}`,
      options,
      `user-profile-${uid}`
    );
  }

  // Chat methods
  async getUserChatSessions(userId) {
    const token = localStorage.getItem('firebaseToken');
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    return await this.makeRequest(
      `https://server.anevia.my.id/api/chats/${userId}`,
      options,
      `chat-sessions-${userId}`
    );
  }

  async getChatMessages(userId, sessionId) {
    const token = localStorage.getItem('firebaseToken');
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    return await this.makeRequest(
      `https://server.anevia.my.id/api/chats/${userId}/${sessionId}`,
      options,
      `chat-messages-${userId}-${sessionId}`
    );
  }

  // Offline data management
  async saveOfflineData(key, data) {
    if (pwaManager) {
      await pwaManager.cacheUserData(`offline-${key}`, {
        data: data,
        timestamp: Date.now(),
        synced: false
      });
    }
  }

  async getOfflineData(key) {
    if (pwaManager) {
      const cached = await pwaManager.getCachedUserData(`offline-${key}`);
      return cached ? cached.data : null;
    }
    return null;
  }

  async markAsSynced(key) {
    if (pwaManager) {
      const cached = await pwaManager.getCachedUserData(`offline-${key}`);
      if (cached) {
        cached.synced = true;
        await pwaManager.cacheUserData(`offline-${key}`, cached);
      }
    }
  }

  // Utility methods
  isOffline() {
    return !this.isOnline;
  }

  getPendingRequestsCount() {
    return this.pendingRequests.length;
  }

  async clearCache() {
    if (pwaManager) {
      await pwaManager.clearCache();
    }
  }

  async getCacheStatus() {
    if (pwaManager) {
      return await pwaManager.getCacheSize();
    }
    return null;
  }
}

// Create and export a singleton instance
const offlineAPI = new OfflineAPI();
export default offlineAPI;
