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
          <h2 class="tools-title">Capture or Upload Your Eye Image</h2>
          <p class="tools-subtitle">To check for signs of anemia, please take a clear photo of your eye's conjunctiva (the inner part of your lower eyelid) or upload an existing image.</p>
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
                  <div class="camera-icon">
                    <i class="fas fa-camera"></i>
                  </div>
                  <p class="camera-message">Click to activate camera</p>
                  <p class="camera-hint">Make sure you have good lighting and position your eye clearly</p>
                  <button class="btn btn-primary" id="enable-camera">
                    <i class="fas fa-camera"></i>
                    Enable Camera
                  </button>
                </div>
                <div class="eye-placeholder" id="eye-placeholder">
                  <img src="/eye-placeholder.svg" alt="Eye Placement Guide" width="100%" height="100%">
                </div>
              </div>

              <!-- Upload Interface -->
              <div id="upload-interface" class="upload-container" style="display: none;">
                <div class="file-upload-area" id="file-upload-area">
                  <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p class="upload-text">Drag and drop your eye image here</p>
                  <p class="upload-hint">or click to browse files</p>
                  <p class="upload-info">Supported formats: JPG, JPEG, PNG (Max size: 10MB)</p>
                  <button class="btn btn-primary" id="browse-btn">
                    <i class="fas fa-folder-open"></i>
                    Choose File
                  </button>
                  <input type="file" id="file-input" class="file-input" accept="image/jpeg,image/jpg,image/png">
                </div>
              </div>

              <div class="camera-controls" id="camera-controls">
                <button class="btn btn-primary" id="capture-btn">Capture Photo</button>
                <button class="btn btn-secondary" id="switch-camera-btn">Switch Camera</button>
                <button class="btn btn-secondary" id="stop-camera-btn">Stop Camera</button>
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
          <div class="heading-preview">
            <h1> Preview Image</h1>
          </div>
          <div class="image-preview">
            <img src="" alt="Preview" class="preview-image" id="preview-image">
          </div>
          <div class="preview-controls">
            <button class="btn btn-primary" id="scan-btn">Scan for Anemia</button>
            <button class="btn btn-secondary" id="retake-btn">Retake</button>
          </div>
        </div>

        <!-- Result Container -->
        <div class="result-container" id="result-container">
          <div class="result-image-container" id="result-image-container" style="display: none;">
            <img src="" alt="Scan Image" class="result-image" id="result-image">
          </div>
          <div class="result-box">
            <div class="result-icon" id="result-icon">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="result-text">
              <h3 class="result-title" id="result-title">Analyzing your scan...</h3>
              <p class="result-description" id="result-description">Please wait while we process your image.</p>
            </div>
          </div>

          <!-- Progress Bar Container -->
          <div class="progress-container" id="progress-container" style="display: none;">
            <div class="progress-bar-wrapper">
              <div class="progress-bar" id="progress-bar"></div>
            </div>
            <div class="progress-text" id="progress-text">0%</div>
            <div class="progress-steps">
              <div class="progress-step" id="step-1">
                <div class="step-icon">1</div>
                <span>Upload</span>
              </div>
              <div class="progress-step" id="step-2">
                <div class="step-icon">2</div>
                <span>Process</span>
              </div>
              <div class="progress-step" id="step-3">
                <div class="step-icon">3</div>
                <span>Analyze</span>
              </div>
              <div class="progress-step" id="step-4">
                <div class="step-icon">4</div>
                <span>Complete</span>
              </div>
            </div>
          </div>

          <div class="result-details" id="result-details">
            <!-- Result details will be inserted here -->
          </div>

          <div class="result-actions" id="result-actions">
          <button class="btn btn-primary" id="chat-ai-btn" style="display: none;">
          <i class="fas fa-robot"></i>
          Bicarakan dengan AI Sekarang!
          </button>
          <button class="btn btn-secondary" id="back-btn">
            <i class="fas fa-arrow-left"></i>
            Kembali
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
    const fileUploadArea = this.findElement("#file-upload-area");

    if (browseBtn) {
      this.addEventListener(browseBtn, "click", (e) => {
        e.stopPropagation(); // Prevent event bubbling to fileUploadArea
        fileInput.click();
      });
    }

    if (fileUploadArea) {
      this.addEventListener(fileUploadArea, "click", (e) => {
        // Only trigger file input if the click is not on the browse button
        if (e.target !== browseBtn && !browseBtn.contains(e.target)) {
          fileInput.click();
        }
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
    if (fileUploadArea) {
      this.addEventListener(fileUploadArea, "dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.add("dragover");
      });

      this.addEventListener(fileUploadArea, "dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove("dragover");
      });

      this.addEventListener(fileUploadArea, "drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove("dragover");
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
    const resultContainer = this.findElement("#result-container");

    // Store the image URL for later use in scan result
    this.capturedImageUrl = imageUrl;

    // Hide interfaces
    if (cameraInterface) cameraInterface.style.display = "none";
    if (uploadInterface) uploadInterface.style.display = "none";
    if (cameraControls) cameraControls.style.display = "none";
    if (eyePlaceholder) eyePlaceholder.classList.remove("active");
    if (resultContainer) resultContainer.style.display = "none";

    // Show preview
    if (previewImage) previewImage.src = imageUrl;
    if (previewContainer) {
      previewContainer.style.display = "block";
      previewContainer.classList.add("fade-in");
    }
  }

  showScanResult(result, scanData = null) {
    const resultContainer = this.findElement("#result-container");
    const resultBox = this.findElement(".result-box");
    const resultIcon = this.findElement("#result-icon");
    const resultTitle = this.findElement("#result-title");
    const resultDescription = this.findElement("#result-description");
    const resultDetails = this.findElement("#result-details");
    const resultImageContainer = this.findElement("#result-image-container");
    const resultImage = this.findElement("#result-image");
    const chatAiBtn = this.findElement("#chat-ai-btn");
    const previewContainer = this.findElement("#preview-container");

    // Hide preview and show result
    if (previewContainer) previewContainer.style.display = "none";
    if (resultContainer) {
      resultContainer.style.display = "block";
      resultContainer.classList.add("fade-in");
    }

    // Show scan image if available
    if (scanData && (scanData.photoUrl || scanData.imageUrl)) {
      let imageUrl = scanData.photoUrl || scanData.imageUrl;

      // Convert relative URLs to absolute URLs
      if (
        imageUrl &&
        !imageUrl.startsWith("http") &&
        !imageUrl.startsWith("blob:")
      ) {
        const API_BASE_URL = "https://server.anevia.my.id";
        imageUrl = imageUrl.startsWith("/")
          ? `${API_BASE_URL}${imageUrl}`
          : `${API_BASE_URL}/${imageUrl}`;
      }

      if (resultImage && resultImageContainer) {
        resultImage.src = imageUrl;
        resultImageContainer.style.display = "block";

        // Add error handling for image loading
        resultImage.onerror = () => {
          console.warn("Failed to load scan image:", imageUrl);
          resultImageContainer.style.display = "none";
        };

        // Add loading indicator
        resultImage.onload = () => {};
      }
    } else if (this.capturedImageUrl) {
      // Use captured image URL if available
      if (resultImage && resultImageContainer) {
        resultImage.src = this.capturedImageUrl;
        resultImageContainer.style.display = "block";
      }
    } else {
      // Hide image container if no image available
      if (resultImageContainer) {
        resultImageContainer.style.display = "none";
      }
    }

    if (result.isLoading) {
      if (resultIcon) {
        resultIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        resultIcon.className = "result-icon loading";
      }
      if (resultTitle) resultTitle.textContent = "Analyzing your scan...";
      if (resultDescription)
        resultDescription.textContent =
          "Please wait while we process your image. This may take a few moments.";
      if (resultDetails) {
        resultDetails.innerHTML = "";
        resultDetails.style.display = "none";
      }

      // Show and start progress bar
      this.showProgressBar();
      this.startProgressAnimation();

      // Hide chat button during loading
      if (chatAiBtn) {
        chatAiBtn.style.display = "none";
      }
    } else {
      // Hide progress bar when loading is complete
      this.hideProgressBar();

      // Show result details when loading is complete
      if (resultDetails) {
        resultDetails.style.display = "block";
      }

      // Reset result-box classes
      if (resultBox) {
        resultBox.classList.remove("no-anemia", "anemia-detected");

        // Add appropriate class based on result
        if (result.isAnemic) {
          resultBox.classList.add("anemia-detected");
        } else {
          resultBox.classList.add("no-anemia");
        }
      }

      if (resultIcon) {
        if (result.isAnemic) {
          resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
          resultIcon.className = "result-icon warning";
        } else {
          resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
          resultIcon.className = "result-icon success";
        }
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
        resultDetails.innerHTML = `
          <h4 class="scan-details-heading">Scan Details</h4>
          ${result.details}
        `;
      }

      // Show/hide chat AI button based on anemia detection
      if (chatAiBtn) {
        if (result.isAnemic) {
          chatAiBtn.style.display = "inline-flex";
        } else {
          chatAiBtn.style.display = "none";
        }
      }
    }
  }

  resetToInitialState() {
    const previewContainer = this.findElement("#preview-container");
    const resultContainer = this.findElement("#result-container");
    const resultBox = this.findElement(".result-box");
    const cameraInterface = this.findElement("#camera-interface");
    const uploadInterface = this.findElement("#upload-interface");
    const cameraControls = this.findElement("#camera-controls");
    const eyePlaceholder = this.findElement("#eye-placeholder");
    const fileInput = this.findElement("#file-input");

    // Hide preview and result containers
    if (previewContainer) {
      previewContainer.style.display = "none";
      previewContainer.classList.remove("fade-in");
    }
    if (resultContainer) {
      resultContainer.style.display = "none";
      resultContainer.classList.remove("fade-in");
    }

    // Hide result details
    const resultDetails = this.findElement("#result-details");
    if (resultDetails) {
      resultDetails.style.display = "none";
      resultDetails.innerHTML = "";
    }

    // Reset result-box classes
    if (resultBox) {
      resultBox.classList.remove("no-anemia", "anemia-detected");
    }

    // Reset progress bar
    this.resetProgressBar();
    this.hideProgressBar();

    // Clear captured image and file input
    this.capturedImage = null;
    if (fileInput) fileInput.value = "";

    // Show appropriate interface based on scan mode
    if (this.scanMode === "camera") {
      if (cameraInterface) cameraInterface.style.display = "block";
      if (uploadInterface) uploadInterface.style.display = "none";
      if (cameraControls) cameraControls.style.display = "flex";
      if (this.stream && this.stream.active && eyePlaceholder) {
        eyePlaceholder.classList.add("active");
      }
    } else {
      if (uploadInterface) uploadInterface.style.display = "block";
      if (cameraInterface) cameraInterface.style.display = "none";
      if (cameraControls) cameraControls.style.display = "none";
    }
  }

  onHide() {
    // Clean up camera when view is hidden
    this.stopCamera();
  }

  // Progress bar methods
  showProgressBar() {
    const progressContainer = this.findElement("#progress-container");
    if (progressContainer) {
      progressContainer.style.display = "block";
    }
  }

  hideProgressBar() {
    const progressContainer = this.findElement("#progress-container");
    if (progressContainer) {
      progressContainer.style.display = "none";
    }
    // Clear any existing intervals
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  startProgressAnimation() {
    const progressBar = this.findElement("#progress-bar");
    const progressText = this.findElement("#progress-text");
    const steps = [
      { id: "step-1", text: "Uploading image...", duration: 1000 },
      { id: "step-2", text: "Processing image...", duration: 2000 },
      { id: "step-3", text: "Analyzing data...", duration: 2500 },
      { id: "step-4", text: "Finalizing results...", duration: 1500 },
    ];

    let progress = 0;
    let currentStep = 0;
    let startTime = Date.now();
    let stepStartTime = startTime;

    // Clear any existing interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    // Reset all steps first
    steps.forEach((step) => {
      const stepElement = this.findElement(`#${step.id}`);
      if (stepElement) {
        stepElement.classList.remove("active", "completed");
      }
    });

    // Start with first step
    const firstStep = this.findElement("#step-1");
    if (firstStep) {
      firstStep.classList.add("active");
    }

    this.progressInterval = setInterval(() => {
      const currentTime = Date.now();
      const stepElapsed = currentTime - stepStartTime;

      // Calculate progress based on current step
      const currentStepData = steps[currentStep];
      if (currentStepData) {
        const stepProgress = Math.min(
          stepElapsed / currentStepData.duration,
          1
        );
        const baseProgress = (currentStep / steps.length) * 100;
        const stepContribution = (stepProgress / steps.length) * 100;
        progress = baseProgress + stepContribution;
      }

      // Ensure progress doesn't exceed 95% until we're done
      if (progress > 95 && currentStep < steps.length - 1) {
        progress = 95;
      }

      // Update progress bar
      if (progressBar) {
        progressBar.style.width = progress + "%";
      }

      // Update progress text
      if (progressText) {
        progressText.textContent = Math.round(progress) + "%";
      }

      // Check if current step is completed
      if (
        stepElapsed >= currentStepData.duration &&
        currentStep < steps.length - 1
      ) {
        // Mark current step as completed
        const currentStepElement = this.findElement(`#${currentStepData.id}`);
        if (currentStepElement) {
          currentStepElement.classList.remove("active");
          currentStepElement.classList.add("completed");

          // Update icon to show checkmark
          const stepIcon = currentStepElement.querySelector(".step-icon");
          if (stepIcon) {
            stepIcon.textContent = "";
          }
        }

        // Move to next step
        currentStep++;
        stepStartTime = currentTime;

        const nextStepData = steps[currentStep];
        if (nextStepData) {
          const nextStepElement = this.findElement(`#${nextStepData.id}`);
          if (nextStepElement) {
            nextStepElement.classList.add("active");
          }

          // Update result description with current step
          const resultDescription = this.findElement("#result-description");
          if (resultDescription) {
            resultDescription.textContent = nextStepData.text;
          }
        }
      }

      // Complete the progress when all steps are done
      if (
        currentStep >= steps.length - 1 &&
        stepElapsed >= currentStepData.duration
      ) {
        progress = 100;

        if (progressBar) {
          progressBar.style.width = "100%";
        }

        if (progressText) {
          progressText.textContent = "100%";
        }

        // Mark final step as completed
        const finalStepElement = this.findElement(`#${currentStepData.id}`);
        if (finalStepElement) {
          finalStepElement.classList.remove("active");
          finalStepElement.classList.add("completed");

          // Update icon to show checkmark
          const stepIcon = finalStepElement.querySelector(".step-icon");
          if (stepIcon) {
            stepIcon.textContent = "";
          }
        }

        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    }, 100); // Update every 100ms for smoother animation
  }

  resetProgressBar() {
    const progressBar = this.findElement("#progress-bar");
    const progressText = this.findElement("#progress-text");
    const steps = ["step-1", "step-2", "step-3", "step-4"];

    if (progressBar) {
      progressBar.style.width = "0%";
    }

    if (progressText) {
      progressText.textContent = "0%";
    }

    // Reset all steps
    steps.forEach((stepId) => {
      const stepElement = this.findElement(`#${stepId}`);
      if (stepElement) {
        stepElement.classList.remove("active", "completed");
      }
    });

    // Clear interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  destroy() {
    // Stop camera if it's running
    this.stopCamera();

    // Clear progress interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    // Remove cleanup event listeners
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    window.removeEventListener("beforeunload", this.handleBeforeUnload);

    // Call parent destroy
    super.destroy();
  }

  async switchCamera() {
    // Get all video input devices
    let devices = [];
    try {
      devices = await navigator.mediaDevices.enumerateDevices();
    } catch (e) {
      // fallback to facingMode if enumerateDevices fails
    }
    const videoDevices = devices.filter((d) => d.kind === "videoinput");

    // Get current facing mode
    let currentFacingMode = "environment";
    if (this.stream && this.stream.getVideoTracks().length > 0) {
      const settings = this.stream.getVideoTracks()[0].getSettings();
      if (settings.facingMode) currentFacingMode = settings.facingMode;
    }
    // Toggle facing mode
    const newFacingMode =
      currentFacingMode === "environment" ? "user" : "environment";

    // Try to find deviceId for the new facing mode
    let deviceId = null;
    for (const device of videoDevices) {
      if (device.label.toLowerCase().includes(newFacingMode)) {
        deviceId = device.deviceId;
        break;
      }
    }

    // Stop current stream
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    // Try to get new stream with deviceId if available, else fallback to facingMode
    let constraints;
    if (deviceId) {
      constraints = { video: { deviceId: { exact: deviceId } } };
    } else {
      constraints = { video: { facingMode: newFacingMode } };
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = this.findElement(".camera-feed");
      if (videoElement) videoElement.srcObject = this.stream;
      const eyePlaceholder = this.findElement("#eye-placeholder");
      if (eyePlaceholder) eyePlaceholder.classList.add("active");
    } catch (error) {
      console.error("Error switching camera:", error);
      this.showError("Failed to switch camera");
    }
  }
}
