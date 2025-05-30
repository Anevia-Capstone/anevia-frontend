// Scan History View for displaying scan history
import BaseView from "./BaseView.js";

export default class ScanHistoryView extends BaseView {
  constructor() {
    super("scan-history");
    this.createScanHistorySection();
    this.isLoading = false;
    this.scans = [];
    this.init();
  }

  createScanHistorySection() {
    // Check if scan history section already exists
    this.container = document.getElementById("scan-history");

    if (!this.container) {
      // Create scan history section and add it to main element
      this.container = document.createElement("section");
      this.container.id = "scan-history";
      this.container.className = "section scan-history-section";
      this.container.style.display = "none";

      // Append to main element
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.appendChild(this.container);
      } else {
        // Fallback to body if main not found
        document.body.appendChild(this.container);
      }
    }
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const html = `
      <div class="scan-history-container">
        <div class="scan-history-header">
          <h1>Chat History</h1>
          <button class="back-btn" id="backToTools">
            <i class="fas fa-arrow-left"></i> Back to Tools
          </button>
        </div>

        <div class="scan-history-content">
          <div class="scan-history-stats" id="chatStats">
            <!-- Stats will be inserted here -->
          </div>

          <div class="scan-history-list" id="chatHistoryList">
            <!-- Chat history items will be inserted here -->
          </div>

          <div class="loading-container" id="loadingContainer" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Loading chat history...</p>
          </div>

          <div class="empty-state" id="emptyState" style="display: none;">
            <div class="empty-icon">
              <i class="fas fa-comments"></i>
            </div>
            <h3>No Chat History</h3>
            <p>You haven't started any conversations with ChatVia yet. Perform a scan and start chatting!</p>
            <button class="btn btn-primary" id="startScanBtn">
              <i class="fas fa-camera"></i>
              Start First Scan
            </button>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    const backBtn = this.findElement("#backToTools");
    const startScanBtn = this.findElement("#startScanBtn");

    if (backBtn) {
      this.addEventListener(backBtn, "click", () => {
        this.onBackToTools();
      });
    }

    if (startScanBtn) {
      this.addEventListener(startScanBtn, "click", () => {
        this.onStartScan();
      });
    }
  }

  // Display chat history
  displayChatHistory(sessions, stats) {
    this.sessions = sessions;
    this.displayStats(stats);
    this.displaySessionList(sessions);
  }

  // Display chat statistics
  displayStats(stats) {
    const statsContainer = this.findElement("#chatStats");
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${stats.totalSessions}</div>
          <div class="stat-label">Total Chats</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.sessionsWithScans}</div>
          <div class="stat-label">Scan-based Chats</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.recentSessions}</div>
          <div class="stat-label">Recent Chats</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.averageSessionsPerWeek}</div>
          <div class="stat-label">Weekly Average</div>
        </div>
      </div>
    `;
  }

  // Display session list
  displaySessionList(sessions) {
    const listContainer = this.findElement("#chatHistoryList");
    const emptyState = this.findElement("#emptyState");

    if (!listContainer) return;

    if (sessions.length === 0) {
      listContainer.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    listContainer.style.display = "block";

    listContainer.innerHTML = `
      <div class="chat-list-header">
        <h3>Recent Conversations</h3>
      </div>
      <div class="chat-items">
        ${sessions.map(session => this.renderSessionItem(session)).join("")}
      </div>
    `;

    // Add event listeners for chat buttons
    const chatButtons = listContainer.querySelectorAll('.view-chat-btn');
    chatButtons.forEach(button => {
      this.addEventListener(button, 'click', (e) => {
        const sessionId = e.target.closest('.view-chat-btn').dataset.sessionId;
        this.onViewChat(sessionId);
      });
    });
  }

  // Render individual chat session item
  renderSessionItem(session) {
    const formattedDate = session.updatedAt.toLocaleDateString();
    const formattedTime = session.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const scanId = session.scanId || 'N/A';

    // Extract scan info from title
    const isScanBased = session.title.includes('Scan');
    const sessionIcon = isScanBased ? "fas fa-microscope" : "fas fa-comments";
    const sessionType = isScanBased ? "Scan Discussion" : "General Chat";

    return `
      <div class="chat-item" data-session-id="${session.sessionId}">
        <div class="chat-item-icon">
          <i class="${sessionIcon}"></i>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-header">
            <h4 class="chat-item-title">${session.title}</h4>
            <span class="chat-item-date">${formattedDate} ${formattedTime}</span>
          </div>
          <div class="chat-item-type">
            <i class="fas fa-tag"></i>
            <span>${sessionType}</span>
          </div>
          ${scanId !== 'N/A' ? `
          <div class="chat-item-scan">
            <i class="fas fa-link"></i>
            <span>Related to Scan: ${scanId}</span>
          </div>
          ` : ''}
        </div>
        <div class="chat-item-actions">
          <button class="btn btn-sm btn-primary view-chat-btn" data-session-id="${session.sessionId}">
            <i class="fas fa-comments"></i>
            Continue Chat
          </button>
        </div>
      </div>
    `;
  }

  // Show loading state
  showLoading() {
    const loadingContainer = this.findElement("#loadingContainer");
    const chatHistoryList = this.findElement("#chatHistoryList");
    const emptyState = this.findElement("#emptyState");

    if (loadingContainer) loadingContainer.style.display = "block";
    if (chatHistoryList) chatHistoryList.style.display = "none";
    if (emptyState) emptyState.style.display = "none";
  }

  // Hide loading state
  hideLoading() {
    const loadingContainer = this.findElement("#loadingContainer");
    if (loadingContainer) loadingContainer.style.display = "none";
  }

  // Show error message
  showError(message) {
    const listContainer = this.findElement("#chatHistoryList");
    if (!listContainer) return;

    listContainer.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Error Loading Chat History</h3>
        <p>${message}</p>
        <button class="btn btn-primary" id="retryBtn">
          <i class="fas fa-redo"></i>
          Retry
        </button>
      </div>
    `;

    // Add retry button listener
    const retryBtn = this.findElement("#retryBtn");
    if (retryBtn) {
      this.addEventListener(retryBtn, "click", () => {
        this.onRetry();
      });
    }
  }

  // Show the scan history view
  show() {
    if (this.container) {
      // Hide all other sections
      document.querySelectorAll("section.section").forEach((section) => {
        if (section.id !== "scan-history") {
          section.style.display = "none";
        }
      });

      // Show scan history section
      this.container.style.display = "block";
      this.isVisible = true;

      // Scroll to top
      window.scrollTo(0, 0);

      this.onShow();
    }
  }

  // Hide the scan history view
  hide() {
    if (this.container) {
      this.container.style.display = "none";
      this.isVisible = false;
      this.onHide();
    }
  }

  onShow() {
    // Load chat history when shown
    if (this.presenter && typeof this.presenter.handleUserAction === "function") {
      this.presenter.handleUserAction("loadChatHistory");
    }
  }

  onHide() {
    // Clean up when hidden
  }

  onBackToTools() {
    if (this.presenter && typeof this.presenter.handleUserAction === "function") {
      this.presenter.handleUserAction("navigateToTools");
    }
  }

  onStartScan() {
    if (this.presenter && typeof this.presenter.handleUserAction === "function") {
      this.presenter.handleUserAction("navigateToTools");
    }
  }

  onRetry() {
    if (this.presenter && typeof this.presenter.handleUserAction === "function") {
      this.presenter.handleUserAction("loadChatHistory");
    }
  }

  onViewChat(sessionId) {
    if (this.presenter && typeof this.presenter.handleUserAction === "function") {
      this.presenter.handleUserAction("viewChatSession", { sessionId });
    }
  }

  // Method to set presenter reference
  setPresenter(presenter) {
    this.presenter = presenter;
  }
}
