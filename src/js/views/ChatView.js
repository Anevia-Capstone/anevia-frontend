// Chat View for displaying the chat interface with ChatVia AI
import BaseView from "./BaseView.js";

export default class ChatView extends BaseView {
  constructor() {
    super("chat");
    this.messages = [];
    this.isLoading = false;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const html = `
      <div class="container chat-container">
        <div class="chat-content">
          <!-- Chat Messages Area -->
          <div class="chat-messages" id="chat-messages">
            <div class="chat-messages-container">
              <!-- Messages will be inserted here -->
            </div>
          </div>

          <!-- Chat Input Area -->
          <div class="chat-input-area">
            <div class="chat-input-container">
              <div class="chat-input-placeholder" id="chat-input-placeholder">
                <input
                  type="text"
                  class="chat-input"
                  id="chat-input"
                  placeholder="Ask anything"
                  maxlength="1000"
                />
              </div>

              <div class="chat-input-buttons">
                <button class="chat-btn chat-btn-secondary" id="refresh-btn" title="Refresh">
                  <i class="fas fa-redo"></i>
                </button>
                <button class="chat-btn chat-btn-secondary" id="attach-btn" title="Attach">
                  <i class="fas fa-plus"></i>
                </button>
                <button class="chat-btn chat-btn-primary" id="send-btn" title="Send">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div class="chat-loading-overlay" id="chat-loading-overlay" style="display: none;">
          <div class="chat-loading-content">
            <div class="chat-loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p class="chat-loading-text">Starting chat session...</p>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    const chatInput = this.findElement("#chat-input");
    const sendBtn = this.findElement("#send-btn");
    const refreshBtn = this.findElement("#refresh-btn");
    const attachBtn = this.findElement("#attach-btn");

    // Send message on button click
    if (sendBtn) {
      this.addEventListener(sendBtn, "click", () => {
        this.onSendMessage();
      });
    }

    // Send message on Enter key press
    if (chatInput) {
      this.addEventListener(chatInput, "keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.onSendMessage();
        }
      });

      // Auto-resize input and handle input changes
      this.addEventListener(chatInput, "input", () => {
        this.handleInputChange();
      });
    }

    // Refresh button
    if (refreshBtn) {
      this.addEventListener(refreshBtn, "click", () => {
        this.onRefresh();
      });
    }

    // Attach button (placeholder for future file attachment)
    if (attachBtn) {
      this.addEventListener(attachBtn, "click", () => {
        this.onAttach();
      });
    }
  }

  // Handle input changes
  handleInputChange() {
    const chatInput = this.findElement("#chat-input");
    const sendBtn = this.findElement("#send-btn");

    if (chatInput && sendBtn) {
      const hasText = chatInput.value.trim().length > 0;
      sendBtn.disabled = !hasText || this.isLoading;

      if (hasText && !this.isLoading) {
        sendBtn.classList.add("active");
      } else {
        sendBtn.classList.remove("active");
      }
    }
  }

  // Event handlers
  onSendMessage() {
    const chatInput = this.findElement("#chat-input");
    if (!chatInput) return;

    const message = chatInput.value.trim();
    if (!message || this.isLoading) return;

    // Clear input
    chatInput.value = "";
    this.handleInputChange();

    // Notify presenter
    this.notifyPresenter("sendMessage", { message });
  }

  onRefresh() {
    this.notifyPresenter("refresh");
  }

  onAttach() {
    // Placeholder for file attachment functionality
    console.log("Attach functionality not implemented yet");
  }

  // Method to notify presenter of user actions
  notifyPresenter(action, data = {}) {
    if (
      this.presenter &&
      typeof this.presenter.handleUserAction === "function"
    ) {
      this.presenter.handleUserAction(action, data);
    }
  }

  // Method to set presenter reference
  setPresenter(presenter) {
    this.presenter = presenter;
  }

  // Display messages
  displayMessages(messages) {
    const messagesContainer = this.findElement(".chat-messages-container");
    if (!messagesContainer) return;

    this.messages = messages;
    messagesContainer.innerHTML = "";

    messages.forEach((message) => {
      const messageElement = this.createMessageElement(message);
      messagesContainer.appendChild(messageElement);
    });

    // Scroll to bottom
    this.scrollToBottom();
  }

  // Create message element
  createMessageElement(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${
      message.sender === "user" ? "user-message" : "ai-message"
    }`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chat-bubble";

    // Add image if present
    if (message.photoUrl) {
      const img = document.createElement("img");
      img.src = message.photoUrl;
      img.alt = "Scan image";
      img.className = "chat-image";
      bubbleDiv.appendChild(img);
    }

    // Add message text
    const textDiv = document.createElement("div");
    textDiv.className = "chat-text";
    textDiv.textContent = message.message;
    bubbleDiv.appendChild(textDiv);

    messageDiv.appendChild(bubbleDiv);

    return messageDiv;
  }

  // Add a single message
  addMessage(message) {
    const messagesContainer = this.findElement(".chat-messages-container");
    if (!messagesContainer) return;

    this.messages.push(message);
    const messageElement = this.createMessageElement(message);
    messagesContainer.appendChild(messageElement);

    // Scroll to bottom
    this.scrollToBottom();
  }

  // Show "AI is thinking" message
  showAIThinking() {
    this.hideAIThinking(); // Remove any existing thinking message

    const messagesContainer = this.findElement(".chat-messages-container");
    if (!messagesContainer) return;

    const thinkingElement = this.createAIThinkingElement();
    thinkingElement.id = "ai-thinking-message";
    messagesContainer.appendChild(thinkingElement);

    // Scroll to bottom
    this.scrollToBottom();
  }

  // Hide "AI is thinking" message
  hideAIThinking() {
    const thinkingMessage = this.findElement("#ai-thinking-message");
    if (thinkingMessage) {
      thinkingMessage.remove();
    }
  }

  // Create "AI is thinking" message element
  createAIThinkingElement() {
    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-message ai-message ai-thinking";

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chat-bubble thinking-bubble";

    const thinkingDiv = document.createElement("div");
    thinkingDiv.className = "thinking-indicator";

    // Add thinking dots animation
    const dotsDiv = document.createElement("div");
    dotsDiv.className = "thinking-dots";

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      dot.className = "thinking-dot";
      dotsDiv.appendChild(dot);
    }

    const textDiv = document.createElement("div");
    textDiv.className = "thinking-text";
    textDiv.textContent = "AI is thinking";

    thinkingDiv.appendChild(textDiv);
    thinkingDiv.appendChild(dotsDiv);
    bubbleDiv.appendChild(thinkingDiv);
    messageDiv.appendChild(bubbleDiv);

    return messageDiv;
  }

  // Scroll to bottom of messages
  scrollToBottom() {
    const messagesArea = this.findElement("#chat-messages");
    if (messagesArea) {
      setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }, 100);
    }
  }

  // Show loading state
  showLoading(message = "Loading...") {
    this.isLoading = true;
    const loadingOverlay = this.findElement("#chat-loading-overlay");
    const loadingText = this.findElement(".chat-loading-text");

    if (loadingText) {
      loadingText.textContent = message;
    }

    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }

    this.handleInputChange(); // Update send button state
  }

  // Hide loading state
  hideLoading() {
    this.isLoading = false;
    const loadingOverlay = this.findElement("#chat-loading-overlay");

    if (loadingOverlay) {
      loadingOverlay.style.display = "none";
    }

    this.handleInputChange(); // Update send button state
  }

  // Show error message
  showError(message) {
    // Add error message to chat
    const errorMessage = {
      sender: "system",
      message: `Error: ${message}`,
      timestamp: new Date().toISOString(),
      type: "error",
    };

    this.addMessage(errorMessage);
  }

  // Clear messages
  clearMessages() {
    const messagesContainer = this.findElement(".chat-messages-container");
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
    }
    this.messages = [];
  }

  // Update view with new data
  update(data) {
    if (data.messages) {
      this.displayMessages(data.messages);
    }

    if (data.isLoading !== undefined) {
      if (data.isLoading) {
        this.showLoading("Sending message...");
      } else {
        this.hideLoading();
      }
    }

    if (data.isAIThinking !== undefined) {
      if (data.isAIThinking) {
        this.showAIThinking();
      } else {
        this.hideAIThinking();
      }
    }
  }

  // Called when view is shown
  onShow() {
    // Focus on input when view is shown
    const chatInput = this.findElement("#chat-input");
    if (chatInput) {
      setTimeout(() => {
        chatInput.focus();
      }, 100);
    }
  }
}
