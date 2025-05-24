// Tools Presenter for managing anemia detection tools logic
import BasePresenter from './BasePresenter.js';
import ToolsView from '../views/ToolsView.js';
import ToolsModel from '../models/ToolsModel.js';

export default class ToolsPresenter extends BasePresenter {
  constructor() {
    const model = new ToolsModel();
    const view = new ToolsView();
    super(model, view);
    
    // Set presenter reference in view
    this.view.setPresenter(this);
  }

  onShow() {
    console.log('ToolsPresenter shown');
    // Scroll to top when showing tools page
    window.scrollTo(0, 0);
  }

  onHide() {
    console.log('ToolsPresenter hidden');
    // Stop camera when hiding tools page
    if (this.view) {
      this.view.stopCamera();
    }
  }

  // Handle user actions from the view
  handleUserAction(action, data = {}) {
    switch (action) {
      case 'cameraEnable':
        this.handleCameraEnable();
        break;
      case 'cameraCapture':
        this.handleCameraCapture();
        break;
      case 'cameraSwitch':
        this.handleCameraSwitch();
        break;
      case 'cameraStop':
        this.handleCameraStop();
        break;
      case 'fileUpload':
        this.handleFileUpload(data.file);
        break;
      case 'scanImage':
        this.handleScanImage();
        break;
      case 'retake':
        this.handleRetake();
        break;
      case 'newScan':
        this.handleNewScan();
        break;
      case 'downloadReport':
        this.handleDownloadReport();
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  async handleCameraEnable() {
    try {
      await this.view.startCamera();
    } catch (error) {
      console.error('Error enabling camera:', error);
      this.showError('Failed to enable camera. Please check your permissions.');
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
      console.error('Error capturing photo:', error);
      this.showError('Failed to capture photo. Please try again.');
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
    // Validate file
    const validation = this.model.validateImageFile(file);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Show preview
    const imageUrl = URL.createObjectURL(file);
    this.view.capturedImage = file;
    this.view.showPreview(imageUrl);
  }

  async handleScanImage() {
    if (!this.view.capturedImage) {
      alert('No image captured or uploaded');
      return;
    }

    // Show loading state
    this.view.showScanResult({ isLoading: true });

    try {
      // Scan image using model
      const result = await this.model.scanImage(this.view.capturedImage);

      if (result.success) {
        // Show scan result
        const scanResult = result.result;
        this.view.showScanResult({
          isLoading: false,
          isAnemic: scanResult.isAnemic,
          description: scanResult.description,
          details: this.formatResultDetails(scanResult.details)
        });
      } else {
        this.showError(result.error || 'Failed to scan image');
      }
    } catch (error) {
      console.error('Error scanning image:', error);
      this.showError('An error occurred while scanning. Please try again.');
    }
  }

  handleRetake() {
    this.view.resetToInitialState();
  }

  handleNewScan() {
    this.view.resetToInitialState();
    this.model.clearCurrentScan();
  }

  handleDownloadReport() {
    const result = this.model.downloadReport();
    
    if (!result.success) {
      alert(result.error || 'Failed to download report');
    }
  }

  // Format result details for display
  formatResultDetails(details) {
    return `
      <div class="result-detail">
        <span class="result-detail-label">Confidence Level:</span>
        <span>${details.confidenceLevel}</span>
      </div>
      <div class="result-detail">
        <span class="result-detail-label">Scan Date:</span>
        <span>${details.scanDate}</span>
      </div>
      <div class="result-detail">
        <span class="result-detail-label">Scan ID:</span>
        <span>${details.scanId}</span>
      </div>
    `;
  }

  // Switch camera between front and back
  async switchCamera() {
    if (!this.view.stream) return;

    try {
      // Stop current stream
      this.view.stream.getTracks().forEach(track => track.stop());

      // Get current facing mode
      const currentFacingMode = this.view.stream.getVideoTracks()[0].getSettings().facingMode;
      const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';

      // Start new stream with different facing mode
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode }
      });

      const videoElement = this.view.findElement('.camera-feed');
      const eyePlaceholder = this.view.findElement('#eye-placeholder');
      
      this.view.stream = newStream;
      if (videoElement) {
        videoElement.srcObject = newStream;
      }

      // Restore eye placeholder if it was active
      if (eyePlaceholder && eyePlaceholder.classList.contains('active')) {
        eyePlaceholder.classList.add('active');
      }

    } catch (error) {
      console.error('Error switching camera:', error);
      this.showError('Failed to switch camera');
    }
  }

  // Update method called when model data changes
  onUpdate(data) {
    if (data.key === 'isScanning') {
      // Update UI based on scanning state
      if (data.value) {
        this.view.showScanResult({ isLoading: true });
      }
    } else if (data.key === 'currentScan') {
      // Update UI with scan result
      const scan = data.value;
      if (scan && scan.result) {
        this.view.showScanResult({
          isLoading: false,
          isAnemic: scan.result.isAnemic,
          description: scan.result.description,
          details: this.formatResultDetails(scan.result.details)
        });
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
}
