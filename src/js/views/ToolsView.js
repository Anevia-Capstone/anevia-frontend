// Tools View for displaying the anemia detection tools
import BaseView from "./BaseView.js";

export default class ToolsView extends BaseView {
  constructor() {
    super("tools");
    this.scanMode = "camera";
    this.stream = null;
    this.capturedImage = null;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.setupCleanupListeners();
  }

  render() {
    const html = `
      <div class="container tools-container">
        <div class="tools-headline">
          <h2 class="tools-title">Welcome to Anemia Detection!</h2>
        </div>

        <div class="tools-content">
          <div class="tools-content-headline">
            <h3 class="tools-content-title">Upload a Picture of Your Eye</h3>
            <p class="tools-content-description">To check for signs of anemia, please upload a clear image of your eye by clicking the button below or dragging and dropping your file into the box.</p>
          </div>

          <div class="tools-file-upload">
            <div class="scan-options">
              <div class="scan-option active" data-mode="camera">
                <div class="scan-option-icon">
                  <i class="fas fa-camera"></i>
                </div>
                <h3 class="scan-option-title">Use Camera</h3>
                <p class="scan-option-description">Take a photo of your eye using your device's camera.</p>
              </div>

              <div class="scan-option" data-mode="upload">
                <div class="scan-option-icon">
                  <i class="fas fa-upload"></i>
                </div>
                <h3 class="scan-option-title">Upload Image</h3>
                <p class="scan-option-description">Upload an existing image of your eye.</p>
              </div>
            </div>

            <div class="scan-interface">
              <!-- Camera Interface -->
              <div id="camera-interface" class="camera-container">
                <video class="camera-feed" autoplay playsinline></video>
                <div class="camera-overlay">
                  <p class="camera-message">Click to active camera</p>
                  <button class="btn btn-primary" id="enable-camera">Enable Camera</button>
                </div>
                <div class="eye-placeholder" id="eye-placeholder">
                  <img src="/src/assets/eye-placeholder.svg" alt="Eye Placement Guide" width="100%" height="100%">
                </div>
              </div>

              <!-- Upload Interface -->
              <div id="upload-interface" class="upload-container" style="display: none;">
                <div class="upload-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <p class="upload-text">Click to upload or drag and drop</p>
                <p class="upload-info">Supported formats: JPG, JPEG, PNG (Max size: 10MB)</p>
                <input type="file" id="file-input" class="file-input" accept="image/jpeg, image/jpg, image/png">
                <button class="btn btn-primary" id="browse-btn">Browse Files</button>
              </div>

              <div class="camera-controls" id="camera-controls">
                <button class="btn btn-primary" id="capture-btn">Capture Photo</button>
                <button class="btn btn-secondary" id="switch-camera-btn">Switch Camera</button>
                <button class="btn btn-secondary" id="stop-camera-btn">Stop Camera</button>
              </div>
            </div>

            <div class="tools-notes">
              <div class="warning-circle">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <p class="tools-notes-text">Don't worry! Your images will be kept confidential.</p>
            </div>
          </div>
        </div>

        <!-- Preview Container -->
        <div class="preview-container" id="preview-container">
          <img src="" alt="Preview" class="preview-image" id="preview-image">
          <div class="preview-controls">
            <button class="btn btn-primary" id="scan-btn">Scan for Anemia</button>
            <button class="btn btn-secondary" id="retake-btn">Retake</button>
          </div>
        </div>

        <!-- Result Container -->
        <div class="result-container" id="result-container">
          <div class="result-icon" id="result-icon">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <h3 class="result-title" id="result-title">Analyzing your scan...</h3>
          <p class="result-description" id="result-description">Please wait while we process your image.</p>

          <div class="result-details" id="result-details">
            <!-- Result details will be inserted here -->
          </div>

          <div class="result-actions">
            <button class="btn btn-secondary" id="back-btn">
              <i class="fas fa-arrow-left"></i>
              Kembali
            </button>
            <button class="btn btn-primary" id="chat-ai-btn">
              <i class="fas fa-robot"></i>
              Bicarakan dengan AI Sekarang!
            </button>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    // Scan option selection
    const scanOptions = this.findElements(".scan-option");
    const cameraInterface = this.findElement("#camera-interface");
    const uploadInterface = this.findElement("#upload-interface");
    const cameraControls = this.findElement("#camera-controls");

    scanOptions.forEach((option) => {
      this.addEventListener(option, "click", () => {
        this.handleScanModeChange(option.dataset.mode);
      });
    });

    // Camera functionality
    const enableCameraBtn = this.findElement("#enable-camera");
    const captureBtn = this.findElement("#capture-btn");
    const switchCameraBtn = this.findElement("#switch-camera-btn");
    const stopCameraBtn = this.findElement("#stop-camera-btn");

    if (enableCameraBtn) {
      this.addEventListener(enableCameraBtn, "click", () => {
        this.onCameraEnable();
      });
    }

    if (captureBtn) {
      this.addEventListener(captureBtn, "click", () => {
        this.onCameraCapture();
      });
    }

    if (switchCameraBtn) {
      this.addEventListener(switchCameraBtn, "click", () => {
        this.onCameraSwitch();
      });
    }

    if (stopCameraBtn) {
      this.addEventListener(stopCameraBtn, "click", () => {
        this.onCameraStop();
      });
    }

    // Upload functionality
    const fileInput = this.findElement("#file-input");
    const browseBtn = this.findElement("#browse-btn");
    const uploadContainer = this.findElement("#upload-interface");

    if (browseBtn) {
      this.addEventListener(browseBtn, "click", () => {
        fileInput.click();
      });
    }

    if (fileInput) {
      this.addEventListener(fileInput, "change", (e) => {
        if (e.target.files.length > 0) {
          this.onFileUpload(e.target.files[0]);
        }
      });
    }

    // Drag and drop functionality
    if (uploadContainer) {
      this.addEventListener(uploadContainer, "dragover", (e) => {
        e.preventDefault();
        uploadContainer.classList.add("dragover");
      });

      this.addEventListener(uploadContainer, "dragleave", () => {
        uploadContainer.classList.remove("dragover");
      });

      this.addEventListener(uploadContainer, "drop", (e) => {
        e.preventDefault();
        uploadContainer.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
          this.onFileUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Preview and scan functionality
    const scanBtn = this.findElement("#scan-btn");
    const retakeBtn = this.findElement("#retake-btn");

    if (scanBtn) {
      this.addEventListener(scanBtn, "click", () => {
        this.onScanImage();
      });
    }

    if (retakeBtn) {
      this.addEventListener(retakeBtn, "click", () => {
        this.onRetake();
      });
    }

    // Result functionality
    const backBtn = this.findElement("#back-btn");
    const chatAiBtn = this.findElement("#chat-ai-btn");
    const newScanBtn = this.findElement("#new-scan-btn");
    const downloadReportBtn = this.findElement("#download-report-btn");

    if (backBtn) {
      this.addEventListener(backBtn, "click", () => {
        this.onBack();
      });
    }

    if (chatAiBtn) {
      this.addEventListener(chatAiBtn, "click", () => {
        this.onChatWithAI();
      });
    }

    if (newScanBtn) {
      this.addEventListener(newScanBtn, "click", () => {
        this.onNewScan();
      });
    }

    if (downloadReportBtn) {
      this.addEventListener(downloadReportBtn, "click", () => {
        this.onDownloadReport();
      });
    }
  }

  setupCleanupListeners() {
    // Define event handlers as class methods so they can be removed later
    this.handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && this.stream) {
        this.stopCamera();
      }
    };

    this.handleBeforeUnload = () => {
      if (this.stream) {
        this.stopCamera();
      }
    };

    // Add event listeners for page visibility changes to stop camera when user leaves
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  }

  // Event handler methods that will be called by presenter
  handleScanModeChange(mode) {
    // Remove active class from all options
    this.findElements(".scan-option").forEach((opt) =>
      opt.classList.remove("active")
    );

    // Add active class to selected option
    const selectedOption = this.findElement(`[data-mode="${mode}"]`);
    if (selectedOption) {
      selectedOption.classList.add("active");
    }

    this.scanMode = mode;

    const cameraInterface = this.findElement("#camera-interface");
    const uploadInterface = this.findElement("#upload-interface");
    const cameraControls = this.findElement("#camera-controls");

    // Show/hide appropriate interface
    if (this.scanMode === "camera") {
      cameraInterface.style.display = "block";
      uploadInterface.style.display = "none";
      cameraControls.style.display = "flex";
    } else {
      cameraInterface.style.display = "none";
      uploadInterface.style.display = "block";
      cameraControls.style.display = "none";
    }
  }

  onCameraEnable() {
    // Notify presenter to handle camera enable
    this.notifyPresenter("cameraEnable");
  }

  onCameraCapture() {
    // Notify presenter to handle camera capture
    this.notifyPresenter("cameraCapture");
  }

  onCameraSwitch() {
    // Notify presenter to handle camera switch
    this.notifyPresenter("cameraSwitch");
  }

  onCameraStop() {
    // Notify presenter to handle camera stop
    this.notifyPresenter("cameraStop");
  }

  onFileUpload(file) {
    // Notify presenter to handle file upload
    this.notifyPresenter("fileUpload", { file });
  }

  onScanImage() {
    // Notify presenter to handle scan
    this.notifyPresenter("scanImage");
  }

  onRetake() {
    // Notify presenter to handle retake
    this.notifyPresenter("retake");
  }

  onBack() {
    // Notify presenter to handle back action
    this.notifyPresenter("back");
  }

  onChatWithAI() {
    // Notify presenter to handle chat with AI
    this.notifyPresenter("chatWithAI");
  }

  onNewScan() {
    // Notify presenter to handle new scan
    this.notifyPresenter("newScan");
  }

  onDownloadReport() {
    // Notify presenter to handle download report
    this.notifyPresenter("downloadReport");
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

  // Camera-related methods that will be called by presenter
  async startCamera() {
    const videoElement = this.findElement(".camera-feed");
    const cameraOverlay = this.findElement(".camera-overlay");
    const eyePlaceholder = this.findElement("#eye-placeholder");

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoElement.srcObject = this.stream;
      cameraOverlay.style.display = "none";
      eyePlaceholder.classList.add("active");
    } catch (error) {
      console.error("Error accessing camera:", error);
      const cameraMessage = cameraOverlay.querySelector(".camera-message");
      if (cameraMessage) {
        cameraMessage.textContent =
          "Camera access denied. Please enable camera permissions.";
      }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;

      const videoElement = this.findElement(".camera-feed");
      const eyePlaceholder = this.findElement("#eye-placeholder");
      const cameraOverlay = this.findElement(".camera-overlay");

      if (videoElement) videoElement.srcObject = null;
      if (eyePlaceholder) eyePlaceholder.classList.remove("active");
      if (cameraOverlay) cameraOverlay.style.display = "flex";
    }
  }

  capturePhoto() {
    const videoElement = this.findElement(".camera-feed");
    if (!videoElement) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          this.capturedImage = blob;
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  }

  showPreview(imageUrl) {
    const previewContainer = this.findElement("#preview-container");
    const previewImage = this.findElement("#preview-image");
    const cameraInterface = this.findElement("#camera-interface");
    const uploadInterface = this.findElement("#upload-interface");
    const cameraControls = this.findElement("#camera-controls");
    const eyePlaceholder = this.findElement("#eye-placeholder");

    // Hide interfaces
    if (cameraInterface) cameraInterface.style.display = "none";
    if (uploadInterface) uploadInterface.style.display = "none";
    if (cameraControls) cameraControls.style.display = "none";
    if (eyePlaceholder) eyePlaceholder.classList.remove("active");

    // Show preview
    if (previewImage) previewImage.src = imageUrl;
    if (previewContainer) previewContainer.classList.add("active");
  }

  showScanResult(result) {
    const resultContainer = this.findElement("#result-container");
    const resultIcon = this.findElement("#result-icon");
    const resultTitle = this.findElement("#result-title");
    const resultDescription = this.findElement("#result-description");
    const resultDetails = this.findElement("#result-details");
    const previewContainer = this.findElement("#preview-container");

    if (previewContainer) previewContainer.classList.remove("active");
    if (resultContainer) resultContainer.classList.add("active");

    if (result.isLoading) {
      if (resultIcon)
        resultIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      if (resultTitle) resultTitle.textContent = "Analyzing your scan...";
      if (resultDescription)
        resultDescription.textContent =
          "Please wait while we process your image.";
      if (resultDetails) resultDetails.innerHTML = "";
    } else {
      if (resultIcon) {
        resultIcon.innerHTML = result.isAnemic
          ? '<i class="fas fa-exclamation-circle"></i>'
          : '<i class="fas fa-check-circle"></i>';
        resultIcon.className = result.isAnemic
          ? "result-icon positive"
          : "result-icon negative";
      }

      if (resultTitle) {
        resultTitle.textContent = result.isAnemic
          ? "Anemia Detected"
          : "No Anemia Detected";
      }

      if (resultDescription) {
        resultDescription.textContent = result.description;
      }

      if (resultDetails && result.details) {
        resultDetails.innerHTML = result.details;
      }
    }
  }

  resetToInitialState() {
    const previewContainer = this.findElement("#preview-container");
    const resultContainer = this.findElement("#result-container");
    const cameraInterface = this.findElement("#camera-interface");
    const uploadInterface = this.findElement("#upload-interface");
    const cameraControls = this.findElement("#camera-controls");
    const eyePlaceholder = this.findElement("#eye-placeholder");

    if (previewContainer) previewContainer.classList.remove("active");
    if (resultContainer) resultContainer.classList.remove("active");

    this.capturedImage = null;

    if (this.scanMode === "camera") {
      if (cameraInterface) cameraInterface.style.display = "block";
      if (cameraControls) cameraControls.style.display = "flex";
      if (this.stream && this.stream.active && eyePlaceholder) {
        eyePlaceholder.classList.add("active");
      }
    } else {
      if (uploadInterface) uploadInterface.style.display = "block";
    }
  }

  onHide() {
    // Clean up camera when view is hidden
    this.stopCamera();
  }

  destroy() {
    // Stop camera if it's running
    this.stopCamera();

    // Remove cleanup event listeners
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    window.removeEventListener("beforeunload", this.handleBeforeUnload);

    // Call parent destroy
    super.destroy();
  }
}
