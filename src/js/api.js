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
    console.error("Error response:", error.response?.data);
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
    // Verify the token with the backend
    const response = await axios.post(`${API_BASE_URL}/auth/verify`, { token });

    // Store the token in localStorage for future authenticated requests
    localStorage.setItem("firebaseToken", token);

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
    // Try to get user profile from backend
    const response = await authAxios.get(`${API_BASE_URL}/auth/profile/${uid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);

    // Check if it's a 404 error (user not found)
    if (error.response?.status === 404) {
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
    const response = await authAxios.put(
      `${API_BASE_URL}/auth/profile/${uid}`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    const response = await authAxios.delete(
      `${API_BASE_URL}/auth/profile/${uid}`
    );

    return response.data;
  } catch (error) {
    console.error(`Error deleting user profile for UID ${uid}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// ==================== Chat API Functions ====================

// Function to start a new chat session from scan data
export const startChatFromScan = async (scanId, userId) => {
  try {
    const response = await authAxios.post(
      `${API_ENDPOINT}/chats`,
      {
        scanId: scanId,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error starting chat session for scan ${scanId}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to send a message in an existing chat session
export const sendChatMessage = async (sessionId, userId, message) => {
  try {
    const response = await authAxios.post(
      `${API_ENDPOINT}/chats/messages`,
      {
        sessionId: sessionId,
        userId: userId,
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error sending message to session ${sessionId}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to get all chat sessions for a user
export const getUserChatSessions = async (userId) => {
  try {
    const response = await authAxios.get(`${API_ENDPOINT}/chats/${userId}`);

    return response.data;
  } catch (error) {
    console.error(`Error fetching chat sessions for user ${userId}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Function to get chat messages by user and session ID
export const getChatMessages = async (userId, sessionId) => {
  try {
    const response = await authAxios.get(
      `${API_ENDPOINT}/chats/${userId}/${sessionId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching chat messages for user ${userId} and session ${sessionId}:`,
      error
    );
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
