// Tools Presenter for managing anemia detection tools logic
import BasePresenter from "./BasePresenter.js";
import ToolsView from "../views/ToolsView.js";
import ToolsModel from "../models/ToolsModel.js";

export default class ToolsPresenter extends BasePresenter {
  constructor() {
    const model = new ToolsModel();
    const view = new ToolsView();
    super(model, view);

    // Set presenter reference in view
    this.view.setPresenter(this);
  }

  onShow() {
    // Scroll to top when showing tools page
    window.scrollTo(0, 0);
  }

  onHide() {
    // Stop camera when hiding tools page
    if (this.view) {
      this.view.stopCamera();
    }
  }

  // Handle user actions from the view
  handleUserAction(action, data = {}) {
    switch (action) {
      case "cameraEnable":
        this.handleCameraEnable();
        break;
      case "cameraCapture":
        this.handleCameraCapture();
        break;
      case "cameraSwitch":
        this.handleCameraSwitch();
        break;
      case "cameraStop":
        this.handleCameraStop();
        break;
      case "fileUpload":
        this.handleFileUpload(data.file);
        break;
      case "scanImage":
        this.handleScanImage();
        break;
      case "retake":
        this.handleRetake();
        break;
      case "back":
        this.handleBack();
        break;
      case "chatWithAI":
        this.handleChatWithAI();
        break;
      case "newScan":
        this.handleNewScan();
        break;
      case "downloadReport":
        this.handleDownloadReport();
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  async handleCameraEnable() {
    try {
      // Show loading state
      this.showMessage("Requesting camera access...", "info");
      await this.view.startCamera();
      this.hideMessage();
    } catch (error) {
      console.error("Error enabling camera:", error);
      let errorMessage = "Failed to enable camera. ";

      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else if (error.name === "NotSupportedError") {
        errorMessage += "Camera is not supported on this browser.";
      } else {
        errorMessage += "Please check your camera permissions and try again.";
      }

      this.showError(errorMessage);
    }
  }

  async handleCameraCapture() {
    try {
      const imageBlob = await this.view.capturePhoto();
      if (imageBlob) {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.view.showPreview(imageUrl);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      this.showError("Failed to capture photo. Please try again.");
    }
  }

  handleCameraSwitch() {
    // Implement camera switching logic
    this.switchCamera();
  }

  handleCameraStop() {
    this.view.stopCamera();
  }

  handleFileUpload(file) {
    try {
      // Validate file
      const validation = this.model.validateImageFile(file);

      if (!validation.valid) {
        this.showError(validation.error);
        return;
      }

      // Show success message
      this.showSuccess(`File "${file.name}" uploaded successfully!`);

      // Show preview
      const imageUrl = URL.createObjectURL(file);
      this.view.capturedImage = file;
      this.view.showPreview(imageUrl);
    } catch (error) {
      console.error("Error handling file upload:", error);
      this.showError("Failed to process the uploaded file. Please try again.");
    }
  }

  async handleScanImage() {
    if (!this.view.capturedImage) {
      this.showError(
        "No image captured or uploaded. Please take a photo or upload an image first."
      );
      return;
    }

    // Show loading state
    this.view.showScanResult({ isLoading: true });

    try {
      // Scan image using model
      const result = await this.model.scanImage(this.view.capturedImage);

      if (result.success) {
        // Get the current scan data from model
        const currentScan = this.model.getCurrentScan();

        // Show scan result with scan data
        const scanResult = result.result;
        this.view.showScanResult(
          {
            isLoading: false,
            isAnemic: scanResult.isAnemic,
            description: scanResult.description,
            details: this.formatResultDetails(
              scanResult.details,
              scanResult.isAnemic
            ),
          },
          currentScan
        );
      } else {
        this.showError(result.error || "Failed to scan image");
      }
    } catch (error) {
      console.error("Error scanning image:", error);
      this.showError("An error occurred while scanning. Please try again.");
    }
  }

  handleRetake() {
    this.view.resetToInitialState();
  }

  handleBack() {
    // Go back to scan interface
    this.view.resetToInitialState();
  }

  handleChatWithAI() {
    // Get current scan data
    const currentScan = this.model.getCurrentScan();

    if (!currentScan || !currentScan.scanId) {
      this.showError(
        "No scan data available for chat. Please complete a scan first."
      );
      return;
    }

    // Navigate to chat with scan data
    // We'll need to emit an event or use a router to navigate
    // For now, let's dispatch a custom event that the main app can listen to
    const chatEvent = new CustomEvent("navigateToChat", {
      detail: {
        scanId: currentScan.scanId,
        scanData: currentScan,
      },
    });
    window.dispatchEvent(chatEvent);
  }

  handleNewScan() {
    this.view.resetToInitialState();
    this.model.clearCurrentScan();
  }

  handleDownloadReport() {
    const result = this.model.downloadReport();

    if (!result.success) {
      this.showError(result.error || "Failed to download report");
    } else {
      this.showSuccess("Report downloaded successfully!");
    }
  }

  // Format result details for display
  formatResultDetails(details, isAnemic = false) {
    return `

      <div class="scan-details-container">
        <div class="scan-info-grid">
          <div class="scan-info-item">
            <span class="scan-info-label">Confidence Level:</span>
            <span class="scan-info-value">${details.confidenceLevel}</span>
          </div>
          <div class="scan-info-item">
            <span class="scan-info-label">Scan Date:</span>
            <span class="scan-info-value">${details.scanDate}</span>
          </div>
          <div class="scan-info-item">
            <span class="scan-info-label">Scan ID:</span>
            <span class="scan-info-value">${details.scanId}</span>
          </div>
        </div>

        ${
          isAnemic
            ? `
        <div class="recommendations-section">
          <h5 class="recommendations-title">Recommendations:</h5>
          <ul class="recommendations-list">
            ${
              details.recommendations
                ? details.recommendations
                    .map((rec) => `<li>${rec}</li>`)
                    .join("")
                : ""
            }
          </ul>
        </div>
        `
            : ""
        }
      </div>
    `;
  }

  // Switch camera between front and back
  async switchCamera() {
    if (!this.view.stream) return;

    try {
      // Stop current stream
      this.view.stream.getTracks().forEach((track) => track.stop());

      // Get current facing mode
      const currentFacingMode = this.view.stream
        .getVideoTracks()[0]
        .getSettings().facingMode;
      const newFacingMode =
        currentFacingMode === "environment" ? "user" : "environment";

      // Start new stream with different facing mode
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      });

      const videoElement = this.view.findElement(".camera-feed");
      const eyePlaceholder = this.view.findElement("#eye-placeholder");

      this.view.stream = newStream;
      if (videoElement) {
        videoElement.srcObject = newStream;
      }

      // Restore eye placeholder if it was active
      if (eyePlaceholder && eyePlaceholder.classList.contains("active")) {
        eyePlaceholder.classList.add("active");
      }
    } catch (error) {
      console.error("Error switching camera:", error);
      this.showError("Failed to switch camera");
    }
  }

  // Update method called when model data changes
  onUpdate(data) {
    if (data.key === "isScanning") {
      // Update UI based on scanning state
      if (data.value) {
        this.view.showScanResult({ isLoading: true });
      }
    } else if (data.key === "currentScan") {
      // Update UI with scan result
      const scan = data.value;
      if (scan && scan.result) {
        this.view.showScanResult(
          {
            isLoading: false,
            isAnemic: scan.result.isAnemic,
            description: scan.result.description,
            details: this.formatResultDetails(
              scan.result.details,
              scan.result.isAnemic
            ),
          },
          scan
        );
      }
    }
  }

  // Get scan statistics for display
  getScanStatistics() {
    return this.model.getScanStatistics();
  }

  // Get scan history
  getScanHistory() {
    return this.model.getScanHistory();
  }

  // Load scan history from API
  async loadScanHistory() {
    try {
      const result = await this.model.loadScanHistory();
      if (result.success) {
        return result;
      } else {
        this.showError(result.error || "Failed to load scan history");
        return result;
      }
    } catch (error) {
      console.error("Error loading scan history:", error);
      this.showError("Failed to load scan history");
      return { success: false, error: error.message };
    }
  }

  // Load specific scan by ID
  async loadScanById(scanId) {
    try {
      const result = await this.model.loadScanById(scanId);
      if (result.success) {
        return result;
      } else {
        this.showError(result.error || "Failed to load scan");
        return result;
      }
    } catch (error) {
      console.error("Error loading scan:", error);
      this.showError("Failed to load scan");
      return { success: false, error: error.message };
    }
  }

  // Show message to user
  showMessage(message, type = "info") {
    // Remove existing messages
    this.hideMessage();

    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}-message`;
    messageElement.textContent = message;
    messageElement.id = "tools-message";

    const container = document.querySelector(".tools-container");
    if (container) {
      container.insertBefore(messageElement, container.firstChild);

      // Add animation
      setTimeout(() => {
        messageElement.classList.add("fade-in");
      }, 10);
    }
  }

  // Hide message
  hideMessage() {
    const existingMessage = document.getElementById("tools-message");
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  // Show error message
  showError(message) {
    this.showMessage(message, "error");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideMessage();
    }, 5000);
  }

  // Show success message
  showSuccess(message) {
    this.showMessage(message, "success");

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hideMessage();
    }, 3000);
  }
}
