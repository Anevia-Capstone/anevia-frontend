// File upload utility functions

/**
 * Validate file type
 * @param {File} file - The file to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if file type is valid
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeInBytes - Maximum allowed file size in bytes
 * @returns {boolean} True if file size is valid
 */
export const validateFileSize = (file, maxSizeInBytes = 10 * 1024 * 1024) => {
  return file.size <= maxSizeInBytes;
};

/**
 * Create a preview URL for a file
 * @param {File} file - The file to create a preview for
 * @returns {string} URL for the file preview
 */
export const createFilePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a preview URL to free up memory
 * @param {string} url - The URL to revoke
 */
export const revokeFilePreview = (url) => {
  URL.revokeObjectURL(url);
};

/**
 * Read a file as a data URL
 * @param {File} file - The file to read
 * @returns {Promise<string>} A promise that resolves with the data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert a data URL to a Blob
 * @param {string} dataURL - The data URL to convert
 * @returns {Blob} The resulting Blob
 */
export const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
