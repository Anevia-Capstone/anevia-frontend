// PWA utilities for cache management and offline functionality
import { Workbox } from "workbox-window";

class PWAManager {
  constructor() {
    this.wb = null;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    this.init();
  }

  async init() {
    // Register service worker
    if ("serviceWorker" in navigator) {
      // Use different service worker paths for dev and production
      const swPath = import.meta.env.DEV ? "/dev-sw.js?dev-sw" : "/sw.js";
      this.wb = new Workbox(swPath);

      // Add event listeners
      this.setupEventListeners();

      // Register the service worker
      try {
        await this.wb.register();
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }

    // Setup online/offline detection
    this.setupNetworkDetection();

    // Setup update notification
    this.setupUpdateNotification();

    // Cache critical resources
    await this.cacheEssentialResources();
  }

  setupEventListeners() {
    if (!this.wb) return;

    // Service worker waiting for activation
    this.wb.addEventListener("waiting", (event) => {
      this.updateAvailable = true;
      this.showUpdateNotification();
    });

    // Service worker activated
    this.wb.addEventListener("controlling", (event) => {
      window.location.reload();
    });

    // Service worker installed for the first time
    this.wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        this.showUpdateNotification();
      } else {
        this.showInstallNotification();
      }
    });
  }

  setupNetworkDetection() {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.showNetworkStatus("online");
      this.syncOfflineData();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.showNetworkStatus("offline");
    });
  }

  setupUpdateNotification() {
    // Check for updates periodically
    setInterval(() => {
      if (this.wb) {
        this.wb.update();
      }
    }, 60000); // Check every minute
  }

  async cacheEssentialResources() {
    if ("caches" in window && !import.meta.env.DEV) {
      try {
        const cache = await caches.open("anevia-essential-v1");
        const essentialResources = [
          "/",
          // "/css/styles.css", // Uncomment if you move styles.css to public/css
          // "/main.js", // Uncomment if you copy main.js to public
          "/logo.svg", // If you move logo.svg to public
          "/favicon.svg", // If you move favicon.svg to public
          // Tambahkan file lain yang memang ada di public
        ];

        await cache.addAll(essentialResources);
      } catch (error) {
        console.error("Failed to cache essential resources:", error);
      }
    } else if (import.meta.env.DEV) {
      console.log("Skipping cache in development mode");
    }
  }

  async cacheUserData(key, data) {
    if ("caches" in window) {
      try {
        const cache = await caches.open("anevia-user-data-v1");
        const response = new Response(JSON.stringify(data));
        await cache.put(key, response);
      } catch (error) {
        console.error("Failed to cache user data:", error);
      }
    }
  }

  async getCachedUserData(key) {
    if ("caches" in window) {
      try {
        const cache = await caches.open("anevia-user-data-v1");
        const response = await cache.match(key);
        if (response) {
          return await response.json();
        }
      } catch (error) {
        console.error("Failed to get cached user data:", error);
      }
    }
    return null;
  }

  async clearCache() {
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      } catch (error) {
        console.error("Failed to clear cache:", error);
      }
    }
  }

  showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "pwa-update-notification";
    notification.innerHTML = `
      <div class="pwa-notification-content">
        <i class="fas fa-download"></i>
        <span>New version available!</span>
        <button class="pwa-update-btn" onclick="pwaManager.applyUpdate()">Update</button>
        <button class="pwa-dismiss-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(notification);
  }

  showInstallNotification() {
    const notification = document.createElement("div");
    notification.className = "pwa-install-notification";
    notification.innerHTML = `
      <div class="pwa-notification-content">
        <i class="fas fa-mobile-alt"></i>
        <span>Install Anevia for better experience!</span>
        <button class="pwa-install-btn" onclick="pwaManager.promptInstall()">Install</button>
        <button class="pwa-dismiss-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(notification);
  }

  showNetworkStatus(status) {
    const statusElement =
      document.getElementById("network-status") ||
      this.createNetworkStatusElement();
    statusElement.className = `network-status ${status}`;
    statusElement.textContent =
      status === "online" ? "Back online" : "You are offline";

    if (status === "online") {
      setTimeout(() => {
        statusElement.style.display = "none";
      }, 3000);
    } else {
      statusElement.style.display = "block";
    }
  }

  createNetworkStatusElement() {
    const statusElement = document.createElement("div");
    statusElement.id = "network-status";
    statusElement.className = "network-status";
    document.body.appendChild(statusElement);
    return statusElement;
  }

  async applyUpdate() {
    if (this.wb && this.updateAvailable) {
      this.wb.messageSkipWaiting();
    }
  }

  async promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
    }
  }

  async syncOfflineData() {
    // Sync any offline data when back online
    // Implementation depends on your specific offline data storage
  }

  isAppOnline() {
    return this.isOnline;
  }

  async getCacheSize() {
    if (
      "caches" in window &&
      "storage" in navigator &&
      "estimate" in navigator.storage
    ) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage,
          available: estimate.quota,
          percentage: Math.round((estimate.usage / estimate.quota) * 100),
        };
      } catch (error) {
        console.error("Failed to get cache size:", error);
      }
    }
    return null;
  }
}

// Create global PWA manager instance
const pwaManager = new PWAManager();

// Listen for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pwaManager.deferredPrompt = e;
});

export default pwaManager;
