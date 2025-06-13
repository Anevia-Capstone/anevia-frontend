// Scan History Presenter for managing chat history functionality
import BasePresenter from "./BasePresenter.js";
import ScanHistoryView from "../views/ScanHistoryView.js";
import ChatModel from "../models/ChatModel.js";

export default class ScanHistoryPresenter extends BasePresenter {
  constructor() {
    const model = new ChatModel();
    const view = new ScanHistoryView();
    super(model, view);

    // Set presenter reference in view
    this.view.setPresenter(this);
    this.currentUserId = null;
  }

  onShow() {
    // Scroll to top when showing chat history page
    window.scrollTo(0, 0);

    // Get current user ID from various sources
    if (!this.currentUserId) {
      // Try to get from localStorage first
      this.currentUserId = localStorage.getItem("currentUserId");

      // If not found, try to get from Firebase token
      if (!this.currentUserId) {
        const firebaseToken = localStorage.getItem("firebaseToken");
        if (firebaseToken) {
          try {
            // Decode JWT token to get user ID (basic decode, not verification)
            const payload = JSON.parse(atob(firebaseToken.split(".")[1]));
            this.currentUserId = payload.user_id || payload.uid;
          } catch (error) {
            console.warn("Could not decode Firebase token:", error);
          }
        }
      }

      // Final fallback
      if (!this.currentUserId) {
        this.currentUserId = "default-user";
        console.warn("Using default user ID for chat history");
      }
    }
  }

  onHide() {}

  // Set user ID
  setUserId(userId) {
    this.currentUserId = userId;
    this.model.setUserId(userId);
  }

  // Handle user actions from view
  handleUserAction(action, data = {}) {
    switch (action) {
      case "loadChatHistory":
        this.loadChatHistory();
        break;
      case "navigateToTools":
        this.navigateToTools();
        break;
      case "viewChatSession":
        this.viewChatSession(data.sessionId);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  }

  // Load chat history from API
  async loadChatHistory() {
    if (!this.currentUserId) {
      console.error("ScanHistoryPresenter: No user ID available");
      this.view.showError("User not authenticated");
      return;
    }

    try {
      this.view.showLoading();

      const result = await this.model.loadUserChatSessions(this.currentUserId);

      this.view.hideLoading();

      if (result.success) {
        const stats = this.getChatStatistics(result.sessions);
        this.view.displayChatHistory(result.sessions, stats);
      } else {
        console.error(
          "ScanHistoryPresenter: Failed to load chat history:",
          result.error
        );
        this.view.showError(result.error || "Failed to load chat history");
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      this.view.hideLoading();
      this.view.showError("An error occurred while loading chat history");
    }
  }

  // Get chat statistics
  getChatStatistics(sessions) {
    const totalSessions = sessions.length;
    const sessionsWithScans = sessions.filter(
      (session) => session.title && session.title.includes("Scan")
    ).length;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentSessions = sessions.filter(
      (session) => new Date(session.updatedAt) > oneWeekAgo
    ).length;

    return {
      totalSessions,
      sessionsWithScans,
      recentSessions,
      averageSessionsPerWeek: Math.round(recentSessions),
    };
  }

  // Navigate to tools page
  navigateToTools() {
    // Dispatch navigation event
    const navigationEvent = new CustomEvent("navigateToTools", {
      detail: { from: "chat-history" },
    });
    window.dispatchEvent(navigationEvent);
  }

  // View chat session
  async viewChatSession(sessionId) {
    if (!this.currentUserId) {
      this.showError("User not authenticated");
      return;
    }

    try {
      // Load chat messages for the session
      const result = await this.model.loadChatMessages(
        this.currentUserId,
        sessionId
      );

      if (result.success) {
        // Dispatch event to show chat view with loaded session
        const chatEvent = new CustomEvent("navigateToChat", {
          detail: {
            sessionId: sessionId,
            userId: this.currentUserId,
            messages: result.messages,
          },
        });
        window.dispatchEvent(chatEvent);
      } else {
        this.showError(result.error || "Failed to load chat session");
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
      this.showError("An error occurred while loading chat session");
    }
  }

  // Show error message
  showError(message) {
    // Create and show error message
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: rgba(244, 67, 54, 0.1);
      border: 1px solid rgba(244, 67, 54, 0.3);
      color: #d32f2f;
      padding: 16px;
      border-radius: 8px;
      z-index: 1000;
      max-width: 300px;
    `;

    document.body.appendChild(errorElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorElement.parentElement) {
        errorElement.remove();
      }
    }, 5000);
  }

  // Show success message
  showSuccess(message) {
    // Create and show success message
    const successElement = document.createElement("div");
    successElement.className = "success-message";
    successElement.textContent = message;
    successElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid rgba(76, 175, 80, 0.3);
      color: #388e3c;
      padding: 16px;
      border-radius: 8px;
      z-index: 1000;
      max-width: 300px;
    `;

    document.body.appendChild(successElement);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (successElement.parentElement) {
        successElement.remove();
      }
    }, 3000);
  }
}
