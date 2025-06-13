// Chat Model for managing chat functionality with ChatVia AI
import BaseModel from "./BaseModel.js";
import {
  startChatFromScan,
  sendChatMessage,
  getUserChatSessions,
  getChatMessages,
} from "../api.js";

export default class ChatModel extends BaseModel {
  constructor() {
    super();
    this.currentSession = null;
    this.messages = [];
    this.chatSessions = [];
    this.isLoading = false;
    this.currentUserId = null;
  }

  // Set current user ID
  setUserId(userId) {
    this.currentUserId = userId;
    this.setData("currentUserId", userId);
  }

  // Start a new chat session from scan data
  async startChatFromScan(scanId, userId) {
    if (this.isLoading) {
      return { success: false, error: "Chat operation already in progress" };
    }

    try {
      this.isLoading = true;
      this.setData("isLoading", true);

      // Call API to start chat session
      const response = await startChatFromScan(scanId, userId);

      if (response.status === "success") {
        // Set current session
        this.currentSession = {
          sessionId: response.data.sessionId,
          userId: userId,
          scanId: scanId,
          createdAt: new Date().toISOString(),
        };

        // Initialize messages with initial conversation
        this.messages = [
          response.data.initialMessage,
          response.data.aiResponse,
        ];

        // Update data
        this.setData("currentSession", this.currentSession);
        this.setData("messages", this.messages);
        this.setData("isLoading", false);

        this.isLoading = false;

        return {
          success: true,
          sessionId: this.currentSession.sessionId,
          messages: this.messages,
        };
      } else {
        throw new Error(response.message || "Failed to start chat session");
      }
    } catch (error) {
      console.error("Error starting chat session:", error);
      this.isLoading = false;
      this.setData("isLoading", false);

      return {
        success: false,
        error: error.message || "Failed to start chat session",
      };
    }
  }

  // Send a message in the current chat session
  async sendMessage(message) {
    if (!this.currentSession) {
      return { success: false, error: "No active chat session" };
    }

    if (this.isLoading) {
      return { success: false, error: "Message already being sent" };
    }

    try {
      this.isLoading = true;

      // Add user message to local messages immediately for better UX
      const userMessage = {
        sessionId: this.currentSession.sessionId,
        sender: "user",
        message: message,
        photoUrl: null,
        timestamp: new Date().toISOString(),
        type: "text",
      };

      this.messages.push(userMessage);
      this.setData("messages", [...this.messages]);

      // Call API to send message
      const response = await sendChatMessage(
        this.currentSession.sessionId,
        this.currentSession.userId,
        message
      );

      if (response.status === "success") {
        // Replace the temporary user message with the one from server
        // and add AI response
        this.messages[this.messages.length - 1] = response.data.userMessage;
        this.messages.push(response.data.aiResponse);

        // Update data
        this.setData("messages", [...this.messages]);

        this.isLoading = false;

        return {
          success: true,
          userMessage: response.data.userMessage,
          aiResponse: response.data.aiResponse,
        };
      } else {
        // Remove the temporary user message on error
        this.messages.pop();
        this.setData("messages", [...this.messages]);
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      this.isLoading = false;

      return {
        success: false,
        error: error.message || "Failed to send message",
      };
    }
  }

  // Load chat messages for a specific session
  async loadChatMessages(userId, sessionId) {
    if (this.isLoading) {
      return { success: false, error: "Chat operation already in progress" };
    }

    try {
      this.isLoading = true;
      this.setData("isLoading", true);

      // Call API to get chat messages
      const response = await getChatMessages(userId, sessionId);

      if (response.status === "success") {
        this.messages = response.data.chatMessages;
        this.currentSession = {
          sessionId: sessionId,
          userId: userId,
        };

        // Update data
        this.setData("messages", this.messages);
        this.setData("currentSession", this.currentSession);
        this.setData("isLoading", false);

        this.isLoading = false;

        return {
          success: true,
          messages: this.messages,
        };
      } else {
        throw new Error(response.message || "Failed to load chat messages");
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      this.isLoading = false;
      this.setData("isLoading", false);

      return {
        success: false,
        error: error.message || "Failed to load chat messages",
      };
    }
  }

  // Get all chat sessions for current user
  async loadUserChatSessions(userId) {
    if (this.isLoading) {
      return { success: false, error: "Chat operation already in progress" };
    }

    try {
      this.isLoading = true;
      this.setData("isLoading", true);

      // Call API to get user chat sessions
      const response = await getUserChatSessions(userId);

      if (response.status === "success") {
        this.chatSessions = response.data.chatSessions.map((session) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          // Extract scan ID from title if available
          scanId: this.extractScanIdFromTitle(session.title),
        }));

        // Update data
        this.setData("chatSessions", this.chatSessions);
        this.setData("isLoading", false);

        this.isLoading = false;

        return {
          success: true,
          sessions: this.chatSessions,
        };
      } else {
        throw new Error(response.message || "Failed to load chat sessions");
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      this.isLoading = false;
      this.setData("isLoading", false);

      return {
        success: false,
        error: error.message || "Failed to load chat sessions",
      };
    }
  }

  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }

  // Get current messages
  getMessages() {
    return this.messages;
  }

  // Extract scan ID from chat title
  extractScanIdFromTitle(title) {
    // Title format: "Chat with ChatVia! about Scan a1b2c3d4"
    const match = title.match(/Scan\s+([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  // Get chat sessions
  getChatSessions() {
    return this.chatSessions;
  }

  // Check if loading
  isLoadingState() {
    return this.isLoading;
  }

  // Set current session
  setCurrentSession(session) {
    this.currentSession = session;
    this.setData("currentSession", session);
  }

  // Clear current session
  clearCurrentSession() {
    this.currentSession = null;
    this.messages = [];
    this.setData("currentSession", null);
    this.setData("messages", []);
  }

  // Clear all data
  clearAllData() {
    this.currentSession = null;
    this.messages = [];
    this.chatSessions = [];
    this.currentUserId = null;
    this.setData("currentSession", null);
    this.setData("messages", []);
    this.setData("chatSessions", []);
    this.setData("currentUserId", null);
  }
}
