// Tools Model for managing anemia detection functionality
import BaseModel from "./BaseModel.js";
import { uploadScanImage, getAllScans, getScanById } from "../api.js";

export default class ToolsModel extends BaseModel {
  constructor() {
    super();
    this.currentScan = null;
    this.scanHistory = [];
    this.isScanning = false;
  }

  // Upload and scan image for anemia detection
  async scanImage(imageFile) {
    if (this.isScanning) {
      return { success: false, error: "Scan already in progress" };
    }

    try {
      this.isScanning = true;
      this.setData("isScanning", true);

      // Upload image to API
      const response = await uploadScanImage(imageFile);
      console.log("Backend scan response received:", response);

      // Check if the API response is successful and contains scan data
      if (response.status === "success" && response.data) {
        // Use the actual scan result from the backend according to new API documentation
        const scanData = response.data;
        const scanId = scanData.scanId;
        const photoUrl = scanData.photoUrl;
        const scanDate = scanData.scanDate;

        // Extract confidence data using helper method
        const confidenceInfo = this.extractConfidenceData(scanData);

        this.currentScan = {
          id: scanId,
          scanId: scanId, // Add scanId for compatibility with chat API
          photoUrl: photoUrl,
          timestamp: new Date(scanDate),
          result: {
            isAnemic: confidenceInfo.isAnemic,
            confidence: confidenceInfo.confidence,
            description: this.getDefaultDescription(confidenceInfo.isAnemic),
            details: {
              confidenceLevel: `${confidenceInfo.confidence}%`,
              scanDate: new Date(scanDate).toLocaleDateString(),
              scanId: scanId,
              photoUrl: photoUrl,
              recommendations: this.getDefaultRecommendations(
                confidenceInfo.isAnemic
              ),
              // Store detailed confidence breakdown if available
              confidenceBreakdown: confidenceInfo.confidenceBreakdown,
            },
          },
          imageFile: imageFile,
          backendData: scanData, // Store original backend response
        };
      } else {
        // Fallback to simulated result if backend doesn't return proper data
        console.warn(
          "Backend scan response not in expected format, using simulated result"
        );
        const scanResult = this.simulateScanResult();
        const scanId = this.generateScanId();

        this.currentScan = {
          id: scanId,
          scanId: scanId,
          timestamp: new Date(),
          result: scanResult,
          imageFile: imageFile,
        };
      }

      // Add to scan history
      this.scanHistory.push(this.currentScan);

      // Update data
      this.setData("currentScan", this.currentScan);
      this.setData("scanHistory", this.scanHistory);
      this.setData("isScanning", false);

      this.isScanning = false;

      return {
        success: true,
        result: this.currentScan.result,
        scanId: this.currentScan.scanId,
      };
    } catch (error) {
      console.error("Error scanning image:", error);
      this.isScanning = false;
      this.setData("isScanning", false);

      return {
        success: false,
        error: error.message || "Failed to scan image",
      };
    }
  }

  // Simulate scan result (replace with actual API response processing)
  simulateScanResult() {
    const isAnemic = Math.random() > 0.5;
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%

    return {
      isAnemic: isAnemic,
      confidence: confidence,
      description: isAnemic
        ? "Our analysis indicates signs of anemia. Please consult with a healthcare professional for further evaluation."
        : "Our analysis does not indicate signs of anemia. Continue to monitor your health regularly.",
      details: {
        confidenceLevel: `${confidence}%`,
        scanDate: new Date().toLocaleDateString(),
        scanId: this.generateScanId(),
        recommendations: isAnemic
          ? [
              "Based on your scan results, it is recommended to consult with a healthcare professional for further evaluation and guidance. Anemia may require medical attention andtreatment.",
            ]
          : [
              "Continue regular health monitoring",
              "Maintain a balanced diet",
              "Schedule routine health checkups",
            ],
      },
    };
  }

  // Generate unique scan ID
  generateScanId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Helper method to extract confidence data from different API response formats
  extractConfidenceData(scanData) {
    // For POST /api/scans response (with detectionDetails)
    if (scanData.detectionDetails && scanData.detectionDetails.confidence) {
      const confidenceData = scanData.detectionDetails.confidence;
      const anemicConfidence = confidenceData.Anemic;
      const nonAnemicConfidence = confidenceData["Non-Anemic"];
      const detectionResult = scanData.detectionDetails.detection;
      const isAnemic = detectionResult === "Anemic";
      const primaryConfidence = isAnemic
        ? anemicConfidence
        : nonAnemicConfidence;

      return {
        isAnemic,
        confidence: Math.round(primaryConfidence * 100),
        confidenceBreakdown: {
          anemic: Math.round(anemicConfidence * 100),
          nonAnemic: Math.round(nonAnemicConfidence * 100),
          detection: detectionResult,
        },
      };
    }

    // For GET /api/scans and GET /api/scans/{id} response (with single confidence value)
    if (
      scanData.confidence !== undefined &&
      scanData.scanResult !== undefined
    ) {
      const confidencePercentage = Math.round(scanData.confidence * 100);

      return {
        isAnemic: scanData.scanResult,
        confidence: confidencePercentage,
        confidenceBreakdown: null, // Not available in this format
      };
    }

    // Fallback for unknown format
    console.warn("Unknown scan data format, using default confidence");
    return {
      isAnemic: false,
      confidence: 50,
      confidenceBreakdown: null,
    };
  }

  // Get default description based on anemia status
  getDefaultDescription(isAnemic) {
    return isAnemic
      ? "Our analysis indicates signs of anemia. Please consult with a healthcare professional for further evaluation."
      : "Our analysis does not indicate signs of anemia. Continue to monitor your health regularly.";
  }

  // Get default recommendations based on anemia status
  getDefaultRecommendations(isAnemic) {
    return isAnemic
      ? [
          "Consult with a healthcare professional",
          "Consider iron-rich foods in your diet",
          "Schedule a complete blood count test",
        ]
      : [
          "Continue regular health monitoring",
          "Maintain a balanced diet",
          "Schedule routine health checkups",
        ];
  }

  // Get current scan result
  getCurrentScan() {
    return this.currentScan;
  }

  // Get scan history
  getScanHistory() {
    return this.scanHistory;
  }

  // Check if currently scanning
  isScanInProgress() {
    return this.isScanning;
  }

  // Clear current scan
  clearCurrentScan() {
    this.currentScan = null;
    this.setData("currentScan", null);
  }

  // Clear scan history
  clearScanHistory() {
    this.scanHistory = [];
    this.setData("scanHistory", []);
  }

  // Validate image file
  validateImageFile(file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Please upload a valid image file (JPG, JPEG, PNG)",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 10MB limit",
      };
    }

    return { valid: true };
  }

  // Generate report content
  generateReport(scanResult = null) {
    const scan = scanResult || this.currentScan;

    if (!scan) {
      return null;
    }

    const result = scan.result;
    const details = result.details;

    return `
Anevia Anemia Detection Report
==============================

Result: ${result.isAnemic ? "Anemia Detected" : "No Anemia Detected"}

${result.description}

Details:
- Confidence Level: ${details.confidenceLevel}
- Scan Date: ${details.scanDate}
- Scan ID: ${details.scanId}

Recommendations:
${details.recommendations.map((rec) => `- ${rec}`).join("\n")}

Generated on: ${new Date().toLocaleString()}

Note: This report is for informational purposes only and does not constitute medical advice.
Please consult with a healthcare professional for proper diagnosis and treatment.
    `.trim();
  }

  // Download report as text file
  downloadReport(scanResult = null) {
    const reportContent = this.generateReport(scanResult);

    if (!reportContent) {
      return { success: false, error: "No scan result available" };
    }

    try {
      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `anevia-report-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Error downloading report:", error);
      return { success: false, error: "Failed to download report" };
    }
  }

  // Load scan history from API
  async loadScanHistory() {
    try {
      const response = await getAllScans();
      console.log("Scan history loaded from API:", response);

      if (response && !response.error && response.listScans) {
        // Transform API response to match internal data structure
        this.scanHistory = response.listScans.map((scan) => {
          // Extract confidence data using helper method
          const confidenceInfo = this.extractConfidenceData(scan);

          return {
            id: scan.scanId,
            scanId: scan.scanId,
            photoUrl: scan.photoUrl,
            timestamp: new Date(scan.scanDate),
            result: {
              isAnemic: confidenceInfo.isAnemic,
              confidence: confidenceInfo.confidence,
              description: this.getDefaultDescription(confidenceInfo.isAnemic),
              details: {
                confidenceLevel: `${confidenceInfo.confidence}%`,
                scanDate: new Date(scan.scanDate).toLocaleDateString(),
                scanId: scan.scanId,
                photoUrl: scan.photoUrl,
                recommendations: this.getDefaultRecommendations(
                  confidenceInfo.isAnemic
                ),
                // Store detailed confidence breakdown if available
                confidenceBreakdown: confidenceInfo.confidenceBreakdown,
              },
            },
            backendData: scan,
          };
        });

        this.setData("scanHistory", this.scanHistory);
        return { success: true, scans: this.scanHistory };
      } else {
        console.warn("No scan history found or API error:", response);
        return {
          success: false,
          error: response?.message || "Failed to load scan history",
        };
      }
    } catch (error) {
      console.error("Error loading scan history:", error);
      return {
        success: false,
        error: error.message || "Failed to load scan history",
      };
    }
  }

  // Load specific scan by ID from API
  async loadScanById(scanId) {
    try {
      const response = await getScanById(scanId);
      console.log("Scan loaded from API:", response);

      if (response && !response.error && response.scan) {
        const scan = response.scan;
        // Transform API response to match internal data structure
        // Extract confidence data using helper method
        const confidenceInfo = this.extractConfidenceData(scan);

        const transformedScan = {
          id: scan.scanId,
          scanId: scan.scanId,
          photoUrl: scan.photoUrl,
          timestamp: new Date(scan.scanDate),
          result: {
            isAnemic: confidenceInfo.isAnemic,
            confidence: confidenceInfo.confidence,
            description: this.getDefaultDescription(confidenceInfo.isAnemic),
            details: {
              confidenceLevel: `${confidenceInfo.confidence}%`,
              scanDate: new Date(scan.scanDate).toLocaleDateString(),
              scanId: scan.scanId,
              photoUrl: scan.photoUrl,
              recommendations: this.getDefaultRecommendations(
                confidenceInfo.isAnemic
              ),
              // Store detailed confidence breakdown if available
              confidenceBreakdown: confidenceInfo.confidenceBreakdown,
            },
          },
          backendData: scan,
        };

        return { success: true, scan: transformedScan };
      } else {
        console.warn("Scan not found or API error:", response);
        return { success: false, error: response?.message || "Scan not found" };
      }
    } catch (error) {
      console.error("Error loading scan:", error);
      return { success: false, error: error.message || "Failed to load scan" };
    }
  }

  // Get scan statistics
  getScanStatistics() {
    const totalScans = this.scanHistory.length;
    const anemicScans = this.scanHistory.filter(
      (scan) => scan.result.isAnemic
    ).length;
    const nonAnemicScans = totalScans - anemicScans;

    return {
      totalScans,
      anemicScans,
      nonAnemicScans,
      anemicPercentage:
        totalScans > 0 ? Math.round((anemicScans / totalScans) * 100) : 0,
    };
  }
}
