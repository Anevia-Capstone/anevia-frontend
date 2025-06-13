// Firebase authentication services
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config.js";
import { verifyToken, getUserProfile, refreshToken } from "../api.js";

// Google provider for Google Sign-in
const googleProvider = new GoogleAuthProvider();

// Register a new user with email and password
export const registerWithEmailPassword = async (username, email, password) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update the user profile to add the username
    await updateProfile(userCredential.user, {
      displayName: username,
    });

    // Get the ID token
    const token = await userCredential.user.getIdToken();

    // Verify the token with the backend
    const backendResponse = await verifyToken(token);

    // Get user profile from backend
    const userProfile = await getUserProfile(userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      backendUser: userProfile.user,
      backendResponse: userProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Create user with email and password (alias for registerWithEmailPassword)
export const createUserWithEmailPassword = async (
  email,
  password,
  additionalData = {}
) => {
  const username = additionalData.username || email.split("@")[0];
  return await registerWithEmailPassword(username, email, password);
};

// Sign in with email and password
export const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the ID token
    const token = await userCredential.user.getIdToken();

    // Verify the token with the backend
    await verifyToken(token);

    // Get user profile from backend
    const userProfile = await getUserProfile(userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      backendUser: userProfile.user,
      backendResponse: userProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Get the ID token
    const token = await result.user.getIdToken();

    // Verify the token with the backend
    await verifyToken(token);

    // Get user profile from backend
    const userProfile = await getUserProfile(result.user.uid);

    return {
      success: true,
      user: result.user,
      backendUser: userProfile.user,
      backendResponse: userProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Sign out the current user
export const logoutUser = async () => {
  try {
    // Remove token from localStorage
    localStorage.removeItem("firebaseToken");

    // Sign out from Firebase
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get the current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get the current user's ID token
export const getCurrentUserToken = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const token = await user.getIdToken(forceRefresh);
    // Cache the token
    if (token) {
      localStorage.setItem("firebaseToken", token);
      localStorage.setItem("firebaseTokenExpiry", Date.now() + 55 * 60 * 1000); // 55 minutes
    }
    return token;
  } catch (error) {
    // If force refresh failed, try to get cached token as fallback
    if (forceRefresh) {
      try {
        const cachedToken = localStorage.getItem("firebaseToken");
        const tokenExpiry = localStorage.getItem("firebaseTokenExpiry");

        // Check if cached token is still valid
        if (cachedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
          return cachedToken;
        }
      } catch (cacheError) {
        console.error("Error accessing cached token:", cacheError);
      }
    }

    return null;
  }
};

// Flag to track if we're in the middle of a password change operation
let isPasswordChangeInProgress = false;
let storedUserDataDuringPasswordChange = null;

// Function to set password change flag
export const setPasswordChangeInProgress = (inProgress, userData = null) => {
  isPasswordChangeInProgress = inProgress;
  if (inProgress && userData) {
    // Store user data before password change
    storedUserDataDuringPasswordChange = {
      user: userData.user,
      backendUser: userData.backendUser,
      timestamp: Date.now(),
    };
  } else if (!inProgress) {
    // Clear stored data when password change is complete
    storedUserDataDuringPasswordChange = null;
  }
};

// Listen for authentication state changes
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        // First call callback immediately with Firebase user to prevent logout
        callback(user, null, null);

        // If password change is in progress, be more lenient with token handling
        if (isPasswordChangeInProgress) {
          // During password change, avoid any backend calls that might fail due to token issues
          // Just use Firebase user data and let the natural auth flow handle backend sync later
          return; // Don't make any backend calls, just keep the user logged in
        }

        // Normal token handling for non-password-change scenarios
        let token = localStorage.getItem("firebaseToken");
        const tokenExpiry = localStorage.getItem("firebaseTokenExpiry");

        // Check if token is expired or doesn't exist
        if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
          // Get a fresh token
          token = await getCurrentUserToken(true);

          // If token refresh fails, don't proceed with backend calls
          if (!token) {
            return;
          }
        }

        // Try to get user profile from backend (non-blocking)
        let userProfile = null;
        try {
          // Verify with backend (but don't fail if backend is down)
          await verifyToken(token);
          userProfile = await getUserProfile(user.uid);

          // Call callback again with complete user data
          callback(user, userProfile?.user || null, userProfile);
        } catch (backendError) {
          // Don't throw error, just continue with Firebase user
          // No need to call callback again since we already called it with Firebase user
        }
      } catch (error) {
        // Still call callback with user to prevent logout
        callback(user, null, null);
      }
    } else {
      // If password change is in progress and user becomes null, restore the stored user data
      if (isPasswordChangeInProgress && storedUserDataDuringPasswordChange) {
        const storedData = storedUserDataDuringPasswordChange;

        // Check if stored data is not too old (within 30 seconds)
        if (Date.now() - storedData.timestamp < 30000) {
          callback(storedData.user, storedData.backendUser, null);
          return;
        }
      }

      // User is signed out
      callback(null, null, null);
    }
  });
};

// Set up token refresh
export const setupTokenRefresh = () => {
  // Set up a timer to refresh the token every 50 minutes (tokens expire after 1 hour)
  setInterval(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await refreshToken(user);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
  }, 50 * 60 * 1000); // 50 minutes
};
