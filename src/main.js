// Import CSS file
import "./css/styles.css";

// Import PWA utilities
import pwaManager from "./js/utils/pwa.js";

// Import Firebase
import { auth, app } from "./js/firebase/config.js";
import { onAuthStateChanged, setupTokenRefresh } from "./js/firebase/auth.js";

// Import Router
import Router from "./js/router/Router.js";

// Import Presenters
import HomePresenter from "./js/presenters/HomePresenter.js";
import ToolsPresenter from "./js/presenters/ToolsPresenter.js";
import AboutPresenter from "./js/presenters/AboutPresenter.js";
import LoginPresenter from "./js/presenters/LoginPresenter.js";
import RegisterPresenter from "./js/presenters/RegisterPresenter.js";
import ProfilePresenter from "./js/presenters/ProfilePresenter.js";
import ChatPresenter from "./js/presenters/ChatPresenter.js";
import ScanHistoryPresenter from "./js/presenters/ScanHistoryPresenter.js";

// Import Navigation and Footer components (these remain as components)
import Navigation from "./js/components/Navigation.js";
import Footer from "./js/components/Footer.js";
import UserProfile from "./js/components/UserProfile.js";

// Initialize the application
class App {
  constructor() {
    // Current user state
    this.currentUser = null;
    this.backendUser = null;
    this.backendResponse = null;

    this.init();
  }

  init() {
    // Initialize PWA functionality
    this.initializePWA();

    // Initialize navigation and footer components
    this.navigation = new Navigation();
    this.footer = new Footer();
    this.userProfile = new UserProfile(document.getElementById("header"));

    // Initialize router
    this.router = new Router();
    this.setupRoutes();

    // Setup custom event listeners for navigation
    this.setupCustomEventListeners();

    // Setup Firebase auth state listener
    this.setupFirebaseAuth();

    // Start the router
    this.router.start();
  }

  initializePWA() {
    // PWA is automatically initialized by importing pwaManager
    console.log('PWA functionality initialized');

    // Setup offline/online event handlers for the app
    window.addEventListener('online', () => {
      console.log('App is back online');
      this.handleOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      this.handleOnlineStatus(false);
    });

    // Cache user data when available
    this.setupDataCaching();
  }

  handleOnlineStatus(isOnline) {
    // Update UI based on online/offline status
    const offlineIndicator = document.getElementById('offline-indicator') || this.createOfflineIndicator();

    if (isOnline) {
      offlineIndicator.classList.remove('show');
      // Sync any pending offline data
      this.syncOfflineData();
    } else {
      offlineIndicator.classList.add('show');
    }
  }

  createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator';
    indicator.innerHTML = '<i class="fas fa-wifi"></i>You are currently offline';
    document.body.appendChild(indicator);
    return indicator;
  }

  setupDataCaching() {
    // Cache important user data for offline access
    if ('serviceWorker' in navigator) {
      // Listen for user data changes and cache them
      document.addEventListener('userDataUpdated', (event) => {
        if (event.detail && pwaManager) {
          pwaManager.cacheUserData('user-profile', event.detail);
        }
      });

      // Listen for scan results and cache them
      document.addEventListener('scanResultCached', (event) => {
        if (event.detail && pwaManager) {
          pwaManager.cacheUserData(`scan-${event.detail.scanId}`, event.detail);
        }
      });
    }
  }

  async syncOfflineData() {
    // Sync any offline data when back online
    console.log('Syncing offline data...');
    // This would be implemented based on your specific offline data storage needs
  }

  setupRoutes() {
    // Define routes with their corresponding presenters
    this.router.addRoute("", () => this.showHome());
    this.router.addRoute("home", () => this.showHome());
    this.router.addRoute("about", () => this.showAbout());
    this.router.addRoute("faq", () => this.showHomeWithScroll("faq"));
    this.router.addRoute("tools", () => this.showTools());
    this.router.addRoute("login", () => this.showLogin());
    this.router.addRoute("register", () => this.showRegister());
    this.router.addRoute("profile", () => this.showProfile());
    this.router.addRoute("chat", () => this.showChat());
    this.router.addRoute("scan-history", () => this.showScanHistory());
  }

  setupCustomEventListeners() {
    // Listen for custom navigation events dispatched by components
    document.addEventListener("showLogin", () => {
      this.router.navigate("login");
    });

    document.addEventListener("showRegister", () => {
      this.router.navigate("register");
    });

    document.addEventListener("showProfile", () => {
      this.router.navigate("profile");
    });

    // Listen for navigate to chat event from tools page
    window.addEventListener("navigateToChat", (event) => {
      console.log("Navigate to chat event received:", event.detail);
      this.pendingChatData = event.detail;
      this.router.navigate("chat");
    });

    // Listen for navigate to scan history event
    window.addEventListener("navigateToScanHistory", (event) => {
      console.log("Navigate to scan history event received:", event.detail);
      this.router.navigate("scan-history");
    });

    // Listen for navigate to tools event from scan history
    window.addEventListener("navigateToTools", (event) => {
      console.log("Navigate to tools event received:", event.detail);
      this.router.navigate("tools");
    });
  }

  showHome() {
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.homePresenter) {
      this.homePresenter = new HomePresenter();
    }
    this.homePresenter.show();
  }

  showHomeWithScroll(section) {
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.homePresenter) {
      this.homePresenter = new HomePresenter();
    }
    this.homePresenter.show();

    // Scroll to the specific section after a short delay to ensure page is rendered
    setTimeout(() => {
      this.homePresenter.scrollToSection(section);
    }, 100);
  }

  showTools() {
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.toolsPresenter) {
      this.toolsPresenter = new ToolsPresenter();
    }
    this.toolsPresenter.show();
  }

  showAbout() {
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.aboutPresenter) {
      this.aboutPresenter = new AboutPresenter();
    }
    this.aboutPresenter.show();
  }

  showLogin() {
    this.hideAllPages();
    this.hideHeaderFooter();
    if (!this.loginPresenter) {
      this.loginPresenter = new LoginPresenter();
    }
    this.loginPresenter.show();
  }

  showRegister() {
    this.hideAllPages();
    this.hideHeaderFooter();
    if (!this.registerPresenter) {
      this.registerPresenter = new RegisterPresenter();
    }
    this.registerPresenter.show();
  }

  showProfile() {
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.profilePresenter) {
      this.profilePresenter = new ProfilePresenter();
    }
    this.profilePresenter.show();
  }

  showChat() {
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.chatPresenter) {
      this.chatPresenter = new ChatPresenter();
    }

    // Handle different types of chat initialization
    if (this.pendingChatData) {
      console.log("Main: Initializing chat with pending data:", this.pendingChatData);

      if (this.pendingChatData.sessionId) {
        // Loading existing chat session from history
        console.log("Main: Loading existing chat session:", this.pendingChatData.sessionId);
        this.chatPresenter.loadChatSession(this.pendingChatData.sessionId, this.pendingChatData.messages);
      } else if (this.pendingChatData.scanId) {
        // Starting new chat from scan
        console.log("Main: Starting new chat from scan:", this.pendingChatData.scanId);
        this.chatPresenter.initializeWithScanData(this.pendingChatData);
      }

      this.pendingChatData = null; // Clear after use
    }

    this.chatPresenter.show();
  }

  showScanHistory() {
    console.log("Main: showScanHistory called");
    this.hideAllPages();
    this.showHeaderFooter();
    if (!this.scanHistoryPresenter) {
      console.log("Main: Creating new ScanHistoryPresenter");
      this.scanHistoryPresenter = new ScanHistoryPresenter();
    }

    // Set user ID if available
    if (this.currentUser) {
      console.log("Main: Setting user ID:", this.currentUser.uid);
      this.scanHistoryPresenter.setUserId(this.currentUser.uid);
    } else {
      console.log("Main: No current user available");
    }

    console.log("Main: Showing scan history presenter");
    this.scanHistoryPresenter.show();
  }

  hideAllPages() {
    // Hide all main sections
    document.querySelectorAll("section.section").forEach((section) => {
      section.style.display = "none";
    });

    // Hide any presenter-created pages
    if (this.homePresenter) this.homePresenter.hide();
    if (this.toolsPresenter) this.toolsPresenter.hide();
    if (this.aboutPresenter) this.aboutPresenter.hide();
    if (this.loginPresenter) this.loginPresenter.hide();
    if (this.registerPresenter) this.registerPresenter.hide();
    if (this.profilePresenter) this.profilePresenter.hide();
    if (this.chatPresenter) this.chatPresenter.hide();
    if (this.scanHistoryPresenter) this.scanHistoryPresenter.hide();
  }

  showHeaderFooter() {
    document.getElementById("header").style.display = "";
    document.getElementById("footer").style.display = "";
    document.body.classList.remove("login-page-active");
  }

  hideHeaderFooter() {
    document.getElementById("header").style.display = "none";
    document.getElementById("footer").style.display = "none";
    document.body.classList.add("login-page-active");
  }

  setupFirebaseAuth() {
    // Set up token refresh mechanism
    setupTokenRefresh();

    // Show initial loading state
    this.showAuthLoading(true);

    // Listen for authentication state changes
    onAuthStateChanged((user, backendUser, backendResponse) => {
      console.log("Auth state changed:", user ? "logged in" : "logged out");

      if (user) {
        // User is signed in
        this.currentUser = user;
        this.backendUser = backendUser;
        this.backendResponse = backendResponse;
        console.log("User is signed in:", user.displayName || user.email);

        if (backendUser) {
          console.log("Backend user data:", backendUser);
          // Hide loading only when we have complete user data
          this.showAuthLoading(false);
        } else {
          console.log(
            "Backend user data not available, using Firebase user only"
          );
          // Hide loading even if backend data is not available
          this.showAuthLoading(false);
        }

        // Update UI for logged in user
        this.updateUIForLoggedInUser(user, backendUser);
      } else {
        // User is signed out
        this.currentUser = null;
        this.backendUser = null;
        this.backendResponse = null;
        console.log("User is signed out");

        // Hide loading
        this.showAuthLoading(false);

        // Update UI for logged out user
        this.updateUIForLoggedOutUser();
      }
    });
  }

  updateUIForLoggedInUser(user, backendUser) {
    // Update user profile with user information
    if (this.userProfile) {
      console.log("Updating user profile in main.js with user:", user);
      console.log("Backend user data for UI update:", backendUser);

      // Create a combined user object with proper photo URL handling
      const userToDisplay = {
        ...user,
        // If we have backend user data, merge it but preserve Firebase photoURL if backend doesn't have a full URL
        ...(backendUser && {
          username: backendUser.username,
          displayName: backendUser.username || user.displayName,
          // Only use backend photoUrl if it's a full URL, otherwise keep Firebase photoURL
          photoURL:
            backendUser.photoUrl && backendUser.photoUrl.startsWith("http")
              ? backendUser.photoUrl
              : user.photoURL,
        }),
      };

      console.log("Combined user data for profile:", userToDisplay);
      this.userProfile.updateUserInfo(userToDisplay);
    } else {
      console.error("User profile component not initialized");
      // Try to initialize it if it wasn't done properly
      this.userProfile = new UserProfile(document.getElementById("header"));

      // Create a combined user object with proper photo URL handling
      const userToDisplay = {
        ...user,
        // If we have backend user data, merge it but preserve Firebase photoURL if backend doesn't have a full URL
        ...(backendUser && {
          username: backendUser.username,
          displayName: backendUser.username || user.displayName,
          // Only use backend photoUrl if it's a full URL, otherwise keep Firebase photoURL
          photoURL:
            backendUser.photoUrl && backendUser.photoUrl.startsWith("http")
              ? backendUser.photoUrl
              : user.photoURL,
        }),
      };

      this.userProfile.updateUserInfo(userToDisplay);
    }

    // Update presenters with user data
    if (this.profilePresenter) {
      this.profilePresenter.updateUserData(user, backendUser);
    }
  }

  updateUIForLoggedOutUser() {
    // Update user profile to hide it and show login buttons
    if (this.userProfile) {
      this.userProfile.updateUserInfo(null);
    } else {
      // If user profile component is not initialized, make sure login buttons are visible
      const loginBtns = document.querySelectorAll(".login-btn");
      loginBtns.forEach((btn) => {
        btn.style.display = "";
        btn.textContent = "Login";
      });
    }

    // Update presenters for logged out state
    if (this.profilePresenter) {
      this.profilePresenter.updateUserData(null, null);
    }

    // Only redirect to login if user is on a protected route
    const currentRoute = this.router.getCurrentRoute();
    const protectedRoutes = ["profile"]; // Add more protected routes here if needed

    if (protectedRoutes.includes(currentRoute)) {
      console.log("User logged out from protected route, redirecting to home");
      this.router.navigate("home");
    }
  }

  // Getter methods for presenters to access user data
  getCurrentUser() {
    return this.currentUser;
  }

  getBackendUser() {
    return this.backendUser;
  }

  getBackendResponse() {
    return this.backendResponse;
  }

  showAuthLoading(show) {
    let loadingElement = document.getElementById("auth-loading");

    if (show) {
      if (!loadingElement) {
        loadingElement = document.createElement("div");
        loadingElement.id = "auth-loading";
        loadingElement.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: 'Poppins', sans-serif;
          ">
            <div style="text-align: center;">
              <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
              "></div>
              <p style="margin: 0; color: #666; font-size: 14px;">Loading user data...</p>
            </div>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
        document.body.appendChild(loadingElement);
      }
    } else {
      if (loadingElement) {
        loadingElement.remove();
      }
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
