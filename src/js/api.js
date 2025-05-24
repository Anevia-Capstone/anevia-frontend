// API integration with server.anevia.my.id
import axios from "axios";

const API_BASE_URL = "https://server.anevia.my.id";
const API_ENDPOINT = `${API_BASE_URL}/api`;

// Create an axios instance for authenticated requests
const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the Firebase token in all requests
authAxios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("firebaseToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to upload an image for anemia detection
export const uploadScanImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Use authenticated axios instance for protected endpoints
    const response = await authAxios.post(`${API_ENDPOINT}/scans`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading scan image:", error);
    throw error;
  }
};

// Function to get all scans
export const getAllScans = async () => {
  try {
    const response = await authAxios.get(`${API_ENDPOINT}/scans`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all scans:", error);
    throw error;
  }
};

// Function to get a specific scan by ID
export const getScanById = async (scanId) => {
  try {
    const response = await authAxios.get(`${API_ENDPOINT}/scans/${scanId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scan with ID ${scanId}:`, error);
    throw error;
  }
};

// ==================== Authentication API Functions ====================

// Function to verify Firebase token with the backend
export const verifyToken = async (token) => {
  try {
    console.log(
      "Verifying token with backend:",
      token ? "Token exists" : "No token"
    );

    // Verify the token with the backend
    const response = await axios.post(`${API_BASE_URL}/auth/verify`, { token });

    // Store the token in localStorage for future authenticated requests
    localStorage.setItem("firebaseToken", token);

    console.log("Token verification successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying token:", error);
    console.error("Error response:", error.response?.data);

    // If the backend verification fails, still store the token
    // This allows the app to function with Firebase auth even if backend verification fails
    localStorage.setItem("firebaseToken", token);

    // Return a mock response to prevent breaking the auth flow
    return {
      error: false,
      message:
        "Using Firebase authentication only (backend verification failed)",
      user: { uid: "firebase-only-user" },
    };
  }
};

// Function to get user profile from backend
export const getUserProfile = async (uid) => {
  try {
    console.log(`Fetching user profile for UID ${uid}`);

    // Try to get user profile from backend
    const response = await authAxios.get(`${API_BASE_URL}/auth/profile/${uid}`);
    console.log("User profile fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);

    // Check if it's a 404 error (user not found)
    if (error.response?.status === 404) {
      console.log("User not found in backend, this might be a new user");
      // Return a structure that indicates the user needs to be created
      return {
        error: false,
        message: "User not found in backend (new user)",
        user: null,
        needsCreation: true,
      };
    }

    // For other errors, return a mock user profile to prevent breaking the auth flow
    return {
      error: false,
      message: "Using local user profile (backend error)",
      user: {
        uid: uid,
        username: "User",
        email: "user@example.com",
        photoUrl: null,
        createdAt: new Date().toISOString(),
      },
    };
  }
};

// Function to refresh the token when needed
export const refreshToken = async (user) => {
  try {
    if (!user) return null;

    // Get a fresh token
    const token = await user.getIdToken(true);

    // Store the refreshed token
    localStorage.setItem("firebaseToken", token);

    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Function to upload profile image
export const uploadProfileImage = async (uid, imageFile) => {
  try {
    console.log(`Uploading profile image for UID ${uid}`);

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await authAxios.post(
      `${API_BASE_URL}/auth/profile/${uid}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Profile image uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error uploading profile image for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to link email/password to existing account
export const linkEmailPassword = async (uid, password) => {
  try {
    console.log(`Linking email/password for UID ${uid}`);

    const response = await authAxios.post(
      `${API_BASE_URL}/auth/profile/${uid}/link-password`,
      {
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email/password linked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error linking email/password for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (uid, profileData) => {
  try {
    console.log(`Updating user profile for UID ${uid}`, profileData);

    const response = await authAxios.put(
      `${API_BASE_URL}/auth/profile/${uid}`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User profile updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user profile for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to reset user password
export const resetUserPassword = async (uid, newPassword) => {
  try {
    console.log(`Resetting password for UID ${uid}`);

    const response = await authAxios.put(
      `${API_BASE_URL}/auth/profile/${uid}/reset-password`,
      {
        newPassword: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Password reset successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error resetting password for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to delete user profile
export const deleteUserProfile = async (uid) => {
  try {
    console.log(`Deleting user profile for UID ${uid}`);

    const response = await authAxios.delete(
      `${API_BASE_URL}/auth/profile/${uid}`
    );

    console.log("User profile deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user profile for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
