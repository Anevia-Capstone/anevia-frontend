// Camera utility functions

/**
 * Check if the device has camera support
 * @returns {boolean} True if camera is supported
 */
export const isCameraSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Request camera access with specified constraints
 * @param {Object} constraints - Media constraints object
 * @returns {Promise<MediaStream>} A promise that resolves with the camera stream
 */
export const requestCameraAccess = async (constraints = { video: true }) => {
  if (!isCameraSupported()) {
    throw new Error('Camera not supported on this device or browser');
  }
  
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw error;
  }
};

/**
 * Get available camera devices
 * @returns {Promise<Array>} A promise that resolves with an array of camera devices
 */
export const getCameraDevices = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    throw new Error('Device enumeration not supported');
  }
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error getting camera devices:', error);
    throw error;
  }
};

/**
 * Stop all tracks in a media stream
 * @param {MediaStream} stream - The media stream to stop
 */
export const stopMediaStream = (stream) => {
  if (stream && stream.getTracks) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Capture a still image from a video element
 * @param {HTMLVideoElement} videoElement - The video element to capture from
 * @param {string} format - Image format (default: 'image/jpeg')
 * @param {number} quality - Image quality between 0 and 1 (default: 0.9)
 * @returns {Promise<Blob>} A promise that resolves with the image blob
 */
export const captureImageFromVideo = (videoElement, format = 'image/jpeg', quality = 0.9) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(blob => {
        resolve(blob);
      }, format, quality);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Apply constraints to switch between front and back camera
 * @param {MediaStream} currentStream - The current media stream
 * @param {string} facingMode - The desired camera facing mode ('user' or 'environment')
 * @returns {Promise<MediaStream>} A promise that resolves with the new camera stream
 */
export const switchCamera = async (currentStream, facingMode = 'environment') => {
  // Stop current stream
  stopMediaStream(currentStream);
  
  // Request new stream with specified facing mode
  return await requestCameraAccess({ 
    video: { facingMode: facingMode } 
  });
};

/**
 * Check if the device is mobile
 * @returns {boolean} True if the device is mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
