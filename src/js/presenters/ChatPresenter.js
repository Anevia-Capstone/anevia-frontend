// Chat Presenter for managing chat functionality logic
import BasePresenter from "./BasePresenter.js";
import ChatView from "../views/ChatView.js";
import ChatModel from "../models/ChatModel.js";
import { getCurrentUser } from "../firebase/auth.js";

export default class ChatPresenter extends BasePresenter {
  constructor() {
    const model = new ChatModel();
    const view = new ChatView();
    super(model, view);

    // Set presenter reference in view
    this.view.setPresenter(this);

    // Store scan data for chat initialization
    this.scanData = null;
  }

  onShow() {
    console.log("ChatPresenter shown");
    // Scroll to top when showing chat page
    window.scrollTo(0, 0);
  }

  onHide() {
    console.log("ChatPresenter hidden");
  }

  // Initialize chat with scan data
  async initializeWithScanData(scanData) {
    console.log("Initializing chat with scan data:", scanData);
    this.scanData = scanData;

    // Get current user
    const user = getCurrentUser();
    if (!user) {
      this.view.showError("User not authenticated");
      return;
    }

    // Set user ID in model
    this.model.setUserId(user.uid);

    // Show loading
    this.view.showLoading("Starting chat session...");

    try {
      // Start chat session from scan
      const result = await this.model.startChatFromScan(
        scanData.scanId,
        user.uid
      );

      if (result.success) {
        // Display initial messages
        this.view.displayMessages(result.messages);
        this.view.hideLoading();
      } else {
        this.view.hideLoading();
        this.view.showError(result.error || "Failed to start chat session");
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      this.view.hideLoading();
      this.view.showError("Failed to initialize chat session");
    }
  }

  // Load existing chat session
  async loadChatSession(sessionId) {
    console.log("Loading chat session:", sessionId);

    // Get current user
    const user = getCurrentUser();
    if (!user) {
      this.view.showError("User not authenticated");
      return;
    }

    // Set user ID in model
    this.model.setUserId(user.uid);

    // Show loading
    this.view.showLoading("Loading chat messages...");

    try {
      // Load chat messages
      const result = await this.model.loadChatMessages(user.uid, sessionId);

      if (result.success) {
        // Display messages
        this.view.displayMessages(result.messages);
        this.view.hideLoading();
      } else {
        this.view.hideLoading();
        this.view.showError(result.error || "Failed to load chat messages");
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
      this.view.hideLoading();
      this.view.showError("Failed to load chat session");
    }
  }

  // Handle user actions from the view
  handleUserAction(action, data = {}) {
    switch (action) {
      case "sendMessage":
        this.handleSendMessage(data.message);
        break;
      case "refresh":
        this.handleRefresh();
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  // Handle sending a message
  async handleSendMessage(message) {
    if (!message || !message.trim()) {
      return;
    }

    console.log("Sending message:", message);

    try {
      // Show AI thinking message instead of loading overlay
      this.view.showAIThinking();

      // Send message through model
      const result = await this.model.sendMessage(message.trim());

      this.view.hideAIThinking();

      if (result.success) {
        // Messages are already updated in the model and view through the model's setData calls
        // The view will be updated via the onUpdate method
        console.log("Message sent successfully");
      } else {
        this.view.showError(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      this.view.hideAIThinking();
      this.view.showError("Failed to send message");
    }
  }

  // Handle refresh action
  async handleRefresh() {
    const currentSession = this.model.getCurrentSession();

    if (!currentSession) {
      // If no current session, try to reinitialize with scan data
      if (this.scanData) {
        await this.initializeWithScanData(this.scanData);
      } else {
        this.view.showError("No active session to refresh");
      }
      return;
    }

    console.log("Refreshing chat session");

    try {
      // Reload current session
      await this.loadChatSession(currentSession.sessionId);
    } catch (error) {
      console.error("Error refreshing chat:", error);
      this.view.showError("Failed to refresh chat");
    }
  }

  // Update method called when model data changes
  onUpdate(data) {
    console.log("ChatPresenter onUpdate:", data);

    if (data.key === "messages") {
      // Update view with new messages
      this.view.displayMessages(data.value);
    } else if (data.key === "currentSession") {
      // Session updated
      console.log("Current session updated:", data.value);
    }
  }

  // Get current session info
  getCurrentSession() {
    return this.model.getCurrentSession();
  }

  // Get current messages
  getMessages() {
    return this.model.getMessages();
  }

  // Clear current session
  clearSession() {
    this.model.clearCurrentSession();
    this.view.clearMessages();
    this.scanData = null;
  }

  // Check if chat is ready
  isReady() {
    const session = this.model.getCurrentSession();
    return session !== null;
  }

  // Get scan data
  getScanData() {
    return this.scanData;
  }
}
