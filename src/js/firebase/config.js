// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjL0vu0fiAWZVx125Hldqnk1HmSMuM65o",
  authDomain: "anevia-13e0d.firebaseapp.com",
  projectId: "anevia-13e0d",
  storageBucket: "anevia-13e0d.firebasestorage.app",
  messagingSenderId: "784904923048",
  appId: "1:784904923048:web:763f3a2fa3601cd3519f9d",
  measurementId: "G-KLG7XGM4ZM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if not in a test environment
let analytics;
try {
  // Only initialize analytics if we're in a browser environment
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (error) {
  // Continue without analytics - this is non-critical
  analytics = null;
}

// Initialize Auth with persistence
const auth = getAuth(app);

// Set persistence to local storage to maintain login state across browser sessions
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Error setting Firebase Auth persistence:", error);
});

// Log Firebase initialization

export { app, analytics, auth };
