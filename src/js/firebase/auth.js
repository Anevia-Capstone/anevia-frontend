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
    console.error("Firebase registration error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

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
    console.error("Error getting current user token:", error);
    return null;
  }
};

// Listen for authentication state changes
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        // Check if we have a cached token first
        let token = localStorage.getItem("firebaseToken");
        const tokenExpiry = localStorage.getItem("firebaseTokenExpiry");

        // Check if token is expired or doesn't exist
        if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
          console.log("Token expired or missing, getting fresh token");
          // Get a fresh token
          token = await getCurrentUserToken(true);
        } else {
          console.log("Using cached token");
        }

        // Try to get user profile from backend (non-blocking)
        let userProfile = null;
        try {
          // Verify with backend (but don't fail if backend is down)
          await verifyToken(token);
          userProfile = await getUserProfile(user.uid);
        } catch (backendError) {
          console.warn(
            "Backend unavailable, continuing with Firebase user only:",
            backendError
          );
          // Don't throw error, just continue with Firebase user
        }

        // Call the original callback with both Firebase user and backend user
        callback(user, userProfile?.user || null, userProfile);
      } catch (error) {
        console.error("Error in auth state change handler:", error);
        // Still call callback with user to prevent logout
        callback(user, null, null);
      }
    } else {
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
        console.log("Firebase token refreshed");
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
  }, 50 * 60 * 1000); // 50 minutes
};
