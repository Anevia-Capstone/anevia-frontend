// Profile Model for managing user profile data and operations
import BaseModel from "./BaseModel.js";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  linkEmailPassword,
  resetUserPassword,
  deleteUserProfile,
} from "../api.js";
import { getCurrentUser, logoutUser, getCurrentUserToken } from "../firebase/auth.js";

export default class ProfileModel extends BaseModel {
  constructor() {
    super();
    this.currentUser = null;
    this.backendUser = null;
    this.isLoading = false;
  }

  // Load user profile from backend
  async loadUserProfile() {
    try {
      this.setData("isLoading", true);

      this.currentUser = getCurrentUser();
      if (!this.currentUser) {
        return {
          success: false,
          error: "Please log in to view your profile"
        };
      }

      // Get user profile from backend with better error handling
      try {
        const response = await getUserProfile(this.currentUser.uid);
        this.backendUser = response.user;

        this.setData("currentUser", this.currentUser);
        this.setData("backendUser", this.backendUser);

        return {
          success: true,
          currentUser: this.currentUser,
          backendUser: this.backendUser,
        };
      } catch (backendError) {
        console.warn("Backend profile fetch failed, using Firebase user only:", backendError);
        // Return Firebase user even if backend fails
        this.setData("currentUser", this.currentUser);
        this.setData("backendUser", null);

        return {
          success: true,
          currentUser: this.currentUser,
          backendUser: null,
        };
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      return {
        success: false,
        error: error.message || "Failed to load profile",
      };
    } finally {
      this.setData("isLoading", false);
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      this.setData("isLoading", true);

      if (!this.currentUser) {
        throw new Error("User not authenticated");
      }

      // Validate that we have at least some data to update
      if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error("No profile data provided");
      }

      // Validate username if provided
      if (profileData.username !== undefined) {
        if (!profileData.username || profileData.username.trim() === "") {
          throw new Error("Username cannot be empty");
        }

        const username = profileData.username.trim();
        if (username.length < 2) {
          throw new Error("Username must be at least 2 characters long");
        }
        if (username.length > 50) {
          throw new Error("Username must be less than 50 characters");
        }
      }

      // Validate birthdate format if provided
      if (profileData.birthdate !== undefined && profileData.birthdate !== "") {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(profileData.birthdate)) {
          throw new Error("Birthdate must be in YYYY-MM-DD format");
        }

        const birthDate = new Date(profileData.birthdate);
        const today = new Date();
        if (birthDate > today) {
          throw new Error("Birthdate cannot be in the future");
        }

        // Check if age is reasonable (between 1 and 120 years)
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 1 || age > 120) {
          throw new Error("Please enter a valid birthdate");
        }
      }

      console.log("Sending profile update with data:", profileData);

      const response = await updateUserProfile(
        this.currentUser.uid,
        profileData
      );

      if (response && response.user) {
        this.backendUser = response.user;
        this.setData("backendUser", this.backendUser);
      }

      return {
        success: true,
        user: this.backendUser,
        message: "Profile updated successfully",
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        error: error.message || "Failed to update profile",
      };
    } finally {
      this.setData("isLoading", false);
    }
  }

  // Upload profile image
  async uploadImage(file) {
    try {
      this.setData("isLoading", true);

      if (!this.currentUser) {
        throw new Error("User not authenticated");
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      const response = await uploadProfileImage(this.currentUser.uid, file);
      this.backendUser = response.user;

      this.setData("backendUser", this.backendUser);

      return {
        success: true,
        user: this.backendUser,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return {
        success: false,
        error: error.message || "Failed to upload image",
      };
    } finally {
      this.setData("isLoading", false);
    }
  }

  // Change user password
  async changePassword(newPassword, confirmPassword) {
    try {
      this.setData("isLoading", true);

      if (!this.currentUser) {
        throw new Error("User not authenticated");
      }

      if (!newPassword || !confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await resetUserPassword(this.currentUser.uid, newPassword);

      // Update backend user data with the response
      if (response.user) {
        this.backendUser = response.user;
        this.setData("backendUser", this.backendUser);
      }

      // DON'T refresh Firebase user data immediately after password change
      // The backend password reset might invalidate the current token
      // Let the natural auth state change handle token refresh later
      console.log("Password reset successful, skipping immediate token refresh to avoid auth issues");

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      console.error("Error changing password:", error);
      return {
        success: false,
        error: error.message || "Failed to change password",
      };
    } finally {
      this.setData("isLoading", false);
    }
  }

  // Link email/password authentication
  async linkPassword(password, confirmPassword) {
    try {
      this.setData("isLoading", true);

      if (!this.currentUser) {
        throw new Error("User not authenticated");
      }

      if (!password || !confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await linkEmailPassword(this.currentUser.uid, password);

      // Update backend user data with the response
      if (response.user) {
        this.backendUser = response.user;
        this.setData("backendUser", this.backendUser);
      }

      // DON'T refresh Firebase user data immediately after password link
      // The backend password link might invalidate the current token
      // Let the natural auth state change handle token refresh later
      console.log("Password link successful, skipping immediate token refresh to avoid auth issues");

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      console.error("Error linking password:", error);
      return {
        success: false,
        error: error.message || "Failed to link password",
      };
    } finally {
      this.setData("isLoading", false);
    }
  }

  // Delete user account
  async deleteAccount(confirmText) {
    try {
      this.setData("isLoading", true);

      if (!this.currentUser) {
        throw new Error("User not authenticated");
      }

      if (confirmText !== "DELETE") {
        throw new Error('Please type "DELETE" to confirm');
      }

      await deleteUserProfile(this.currentUser.uid);

      // Log out user after successful deletion
      await logoutUser();

      // Clear local data
      this.currentUser = null;
      this.backendUser = null;
      this.clearData();

      return { success: true };
    } catch (error) {
      console.error("Error deleting account:", error);
      return {
        success: false,
        error: error.message || "Failed to delete account",
      };
    } finally {
      this.setData("isLoading", false);
    }
  }

  // Update user data from external source (e.g., auth state change)
  updateUserData(currentUser, backendUser) {
    this.currentUser = currentUser;
    this.backendUser = backendUser;

    this.setData("currentUser", this.currentUser);
    this.setData("backendUser", this.backendUser);
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get backend user
  getBackendUser() {
    return this.backendUser;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return !!this.currentUser;
  }

  // Check if user has password authentication
  hasPasswordAuth() {
    if (!this.currentUser) return false;
    const providers = this.currentUser.providerData.map((p) => p.providerId);
    return providers.includes("password");
  }

  // Check if user has Google authentication
  hasGoogleAuth() {
    if (!this.currentUser) return false;
    const providers = this.currentUser.providerData.map((p) => p.providerId);
    return providers.includes("google.com");
  }

  // Get user profile image URL
  getProfileImageUrl() {
    let imageUrl = "/src/assets/default-avatar.svg";

    // Priority: backend photoUrl > Firebase photoURL > default
    if (this.backendUser?.photoUrl) {
      // Check if backend photoUrl is a full URL or relative path
      if (this.backendUser.photoUrl.startsWith("http")) {
        // It's already a full URL (e.g., Google Photos URL)
        imageUrl = this.backendUser.photoUrl;
      } else {
        // It's a relative path, prepend backend URL
        imageUrl = `https://server.anevia.my.id${this.backendUser.photoUrl}`;
      }
    } else if (this.currentUser?.photoURL) {
      // Firebase photoURL is always a full URL
      imageUrl = this.currentUser.photoURL;
    }

    return imageUrl;
  }

  // Get user display name
  getDisplayName() {
    return this.backendUser?.username || this.currentUser?.displayName || "";
  }

  // Get user email
  getEmail() {
    return this.backendUser?.email || this.currentUser?.email || "";
  }

  // Get formatted creation date
  getCreationDate() {
    if (this.backendUser?.createdAt) {
      return new Date(this.backendUser.createdAt).toLocaleDateString();
    }
    return "";
  }

  // Get formatted birth date
  getBirthDate() {
    if (this.backendUser?.birthdate) {
      return new Date(this.backendUser.birthdate).toISOString().split("T")[0];
    }
    return "";
  }

  // Refresh Firebase user data to get updated provider information
  async refreshFirebaseUserData() {
    try {
      if (!this.currentUser) return;

      console.log("Refreshing Firebase user data...");

      // Add a longer delay to allow backend changes to propagate
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Reload the user to get updated provider data (this is less likely to cause auth state changes)
      try {
        await this.currentUser.reload();
        console.log("User reload successful");
      } catch (reloadError) {
        console.warn("User reload failed, but continuing:", reloadError);
        // Continue without throwing error
      }

      // Try to refresh token with retry logic, but be more conservative
      let tokenRefreshSuccess = false;
      let retryCount = 0;
      const maxRetries = 2; // Reduced retries to minimize auth state changes

      while (!tokenRefreshSuccess && retryCount < maxRetries) {
        try {
          console.log(`Attempting token refresh (attempt ${retryCount + 1}/${maxRetries})`);

          // Get a fresh token to ensure backend sync, but with longer delays between attempts
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
          await getCurrentUserToken(true);
          tokenRefreshSuccess = true;
          console.log("Token refresh successful");

        } catch (tokenError) {
          retryCount++;
          console.warn(`Token refresh attempt ${retryCount} failed:`, tokenError);

          if (retryCount < maxRetries) {
            // Wait longer before retrying
            await new Promise(resolve => setTimeout(resolve, 3000 * retryCount));
          } else {
            console.error("All token refresh attempts failed, but continuing...");
            // Don't throw error, continue with existing token
          }
        }
      }

      // Update current user reference
      this.currentUser = getCurrentUser();
      this.setData("currentUser", this.currentUser);

      console.log("Firebase user data refreshed successfully");
      console.log("Updated providers:", this.currentUser?.providerData?.map(p => p.providerId));

      // Force a small delay to ensure UI updates properly
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error("Error refreshing Firebase user data:", error);
      // Don't throw error, just log it as this is not critical for password change success
    }
  }
}
