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
        <!-- Chat Header with Back Button -->
        <div class="chat-header">
          <button class="chat-back-btn" id="chat-back-btn" title="Back">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <div class="chat-title">
            <h2>Chat with ChatVia</h2>
            <p>Ask anything about your health scan</p>
          </div>
        </div>

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
    const backBtn = this.findElement("#chat-back-btn");

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

    // Back button
    if (backBtn) {
      this.addEventListener(backBtn, "click", () => {
        this.onBack();
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

  onBack() {
    this.notifyPresenter("back");
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
      let imageUrl = message.photoUrl;

      // Convert relative URLs to absolute URLs
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
        const API_BASE_URL = "https://server.anevia.my.id";
        imageUrl = imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : `${API_BASE_URL}/${imageUrl}`;
      }

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Scan image";
      img.className = "chat-image";

      // Add error handling for image loading
      img.onerror = () => {
        console.warn("Failed to load chat image:", imageUrl);
        // Create a placeholder for failed images
        const placeholder = document.createElement("div");
        placeholder.className = "chat-image-placeholder";
        placeholder.innerHTML = '<i class="fas fa-image"></i><span>Image not available</span>';
        bubbleDiv.replaceChild(placeholder, img);
      };

      // Add loading indicator
      img.onload = () => {
        console.log("Chat image loaded successfully:", imageUrl);
      };

      bubbleDiv.appendChild(img);
    }

    // Add message text
    const textDiv = document.createElement("div");
    textDiv.className = "chat-text";

    // Format message content based on sender
    if (message.sender === "ai") {
      textDiv.innerHTML = this.formatAIMessage(message.message);
    } else {
      textDiv.textContent = message.message;
    }

    bubbleDiv.appendChild(textDiv);

    messageDiv.appendChild(bubbleDiv);

    return messageDiv;
  }

  // Format AI message content with proper line breaks and formatting
  formatAIMessage(message) {
    if (!message) return "";

    // Escape HTML to prevent XSS attacks
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    let formattedMessage = escapeHtml(message);

    // Convert double line breaks to paragraph breaks
    formattedMessage = formattedMessage.replace(/\n\n/g, '</p><p>');

    // Convert single line breaks to <br> tags
    formattedMessage = formattedMessage.replace(/\n/g, '<br>');

    // Format bullet points (lines starting with *, -, or •)
    formattedMessage = formattedMessage.replace(/^(\*|\-|•)\s+(.+)$/gm, '<li>$2</li>');

    // Wrap consecutive list items in <ul> tags
    formattedMessage = formattedMessage.replace(/(<li>.*<\/li>)(\s*<br>\s*<li>.*<\/li>)*/g, (match) => {
      // Remove <br> tags between list items
      const cleanMatch = match.replace(/<br>\s*/g, '');
      return '<ul>' + cleanMatch + '</ul>';
    });

    // Format numbered lists (lines starting with numbers)
    formattedMessage = formattedMessage.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');

    // Wrap consecutive numbered list items in <ol> tags
    formattedMessage = formattedMessage.replace(/(<li>.*<\/li>)(\s*<br>\s*<li>.*<\/li>)*/g, (match) => {
      // Check if this is part of a numbered list by looking for the pattern before it
      const beforeMatch = formattedMessage.substring(0, formattedMessage.indexOf(match));
      if (beforeMatch.match(/\d+\.\s+[^<]*$/)) {
        const cleanMatch = match.replace(/<br>\s*/g, '');
        return '<ol>' + cleanMatch + '</ol>';
      }
      return match;
    });

    // Format bold text (**text** or __text__)
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedMessage = formattedMessage.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Format italic text (*text* or _text_)
    formattedMessage = formattedMessage.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formattedMessage = formattedMessage.replace(/_(.*?)_/g, '<em>$1</em>');

    // Wrap in paragraph tags if not already wrapped
    if (!formattedMessage.startsWith('<p>') && !formattedMessage.startsWith('<ul>') && !formattedMessage.startsWith('<ol>')) {
      formattedMessage = '<p>' + formattedMessage + '</p>';
    } else if (formattedMessage.includes('</p><p>')) {
      formattedMessage = '<p>' + formattedMessage + '</p>';
    }

    return formattedMessage;
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
