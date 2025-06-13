// Profile Presenter for managing profile page logic
import BasePresenter from "./BasePresenter.js";
import ProfileView from "../views/ProfileView.js";
import ProfileModel from "../models/ProfileModel.js";

export default class ProfilePresenter extends BasePresenter {
  constructor() {
    const model = new ProfileModel();
    const view = new ProfileView();
    super(model, view);

    // Set presenter reference in view
    this.view.setPresenter(this);
  }

  onShow() {
    // Load profile when shown
    this.loadProfile();
  }

  onHide() {
    // Hapus semua baris console.log
  }

  // Handle user actions from the view
  handleUserAction(action, data = {}) {
    switch (action) {
      case "loadProfile":
        this.loadProfile();
        break;
      case "backToHome":
        this.navigate("home");
        break;
      case "imageUpload":
        this.handleImageUpload(data.file);
        break;
      case "saveProfile":
        this.handleSaveProfile(data);
        break;
      case "changePassword":
        this.handleChangePassword();
        break;
      case "linkPassword":
        this.handleLinkPassword();
        break;
      case "deleteAccount":
        this.handleDeleteAccount();
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  async loadProfile() {
    try {
      this.view.setLoading(true, "Loading profile data...");

      // Wait a bit for auth state to stabilize on page refresh
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await this.model.loadUserProfile();

      if (result.success) {
        this.view.updateUserData(result.currentUser, result.backendUser);
      } else {
        // Check if this is just a temporary auth state issue
        const currentUser = this.model.getCurrentUser();
        if (!currentUser) {
          // Try to wait for auth state to load
          let retryCount = 0;
          const maxRetries = 3;

          while (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const retryResult = await this.model.loadUserProfile();

            if (retryResult.success) {
              this.view.updateUserData(
                retryResult.currentUser,
                retryResult.backendUser
              );
              return;
            }

            retryCount++;
          }
        }

        this.view.showError(result.error);

        // Only redirect if user is definitely not authenticated after retries
        if (
          result.error.includes("log in") ||
          result.error.includes("not authenticated")
        ) {
          setTimeout(() => {
            this.navigate("home");
          }, 3000); // Increased timeout to give user time to see the error
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Don't show error for network issues, just log them
      if (
        error.message.includes("Network") ||
        error.message.includes("fetch")
      ) {
        console.warn(
          "Network error loading profile, continuing with cached data"
        );
      } else {
        this.view.showError("Failed to load profile. Please try again.");
      }
    } finally {
      this.view.setLoading(false);
    }
  }

  async handleImageUpload(file) {
    try {
      this.view.setLoading(true, "Uploading profile image...");

      const result = await this.model.uploadImage(file);

      if (result.success) {
        this.view.updateUserData(this.model.getCurrentUser(), result.user);
        this.view.showSuccess("Profile image updated successfully");

        // Notify the main app about the profile update so navbar can be refreshed
        this.notifyProfileUpdate(this.model.getCurrentUser(), result.user);
      } else {
        this.view.showError(result.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      this.view.showError("Failed to upload image. Please try again.");
    } finally {
      this.view.setLoading(false);
    }
  }

  async handleSaveProfile(profileData) {
    try {
      this.view.setLoading(true, "Saving profile changes...");

      const result = await this.model.updateProfile(profileData);

      if (result.success) {
        this.view.updateUserData(this.model.getCurrentUser(), result.user);
        this.view.onSaveSuccess();
        this.view.showSuccess("Profile updated successfully");

        // Notify the main app about the profile update so navbar can be refreshed
        this.notifyProfileUpdate(this.model.getCurrentUser(), result.user);
      } else {
        this.view.showError(result.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      this.view.showError("Failed to update profile. Please try again.");
    } finally {
      this.view.setLoading(false);
    }
  }

  handleChangePassword() {
    this.showChangePasswordModal();
  }

  handleLinkPassword() {
    this.showLinkPasswordModal();
  }

  handleDeleteAccount() {
    this.showDeleteAccountModal();
  }

  // Show change password modal
  showChangePasswordModal() {
    const modal = this.createModal(
      "Change Password",
      `
      <div class="modal-form">
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" placeholder="Enter new password" minlength="6">
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" placeholder="Confirm new password">
        </div>
        <div class="modal-actions">
          <button class="action-btn secondary-btn" onclick="this.closest('.modal').remove()">Cancel</button>
          <button class="action-btn primary-btn" id="confirmChangePassword">Change Password</button>
        </div>
      </div>
    `
    );

    const confirmBtn = modal.querySelector("#confirmChangePassword");
    const newPasswordInput = modal.querySelector("#newPassword");
    const confirmPasswordInput = modal.querySelector("#confirmPassword");

    confirmBtn.addEventListener("click", () => {
      this.handleChangePasswordConfirm(modal);
    });

    // Add Enter key support
    [newPasswordInput, confirmPasswordInput].forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleChangePasswordConfirm(modal);
        }
      });
    });
  }

  async handleChangePasswordConfirm(modal) {
    const newPassword = modal.querySelector("#newPassword").value;
    const confirmPassword = modal.querySelector("#confirmPassword").value;

    // Import the flag setter
    const { setPasswordChangeInProgress } = await import("../firebase/auth.js");

    try {
      this.view.setLoading(true, "Changing password...");

      // Store current user data before password change
      const currentUserData = {
        user: this.model.getCurrentUser(),
        backendUser: this.model.getBackendUser(),
      };

      // Set flag to prevent logout during password change and store user data
      setPasswordChangeInProgress(true, currentUserData);

      const result = await this.model.changePassword(
        newPassword,
        confirmPassword
      );

      if (result.success) {
        modal.remove();

        // Hide password warning since user now has password
        const passwordWarning = this.view.findElement("#passwordWarning");
        if (passwordWarning) {
          passwordWarning.style.display = "none";
        }

        // Show success popup modal instead of regular message
        this.showSuccessPopup(
          "Password Changed Successfully",
          "Your password has been updated successfully. You can now use your new password to log in."
        );

        // Update user data if the API returned updated user info
        if (result.user) {
          // Update UI with available data
          this.view.updateUserData(this.model.getCurrentUser(), result.user);
          this.notifyProfileUpdate(this.model.getCurrentUser(), result.user);
        }
      } else {
        this.view.showError(result.error);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      this.view.showError("Failed to change password. Please try again.");
    } finally {
      this.view.setLoading(false);

      // Clear the flag after a longer delay to allow auth state to stabilize
      setTimeout(() => {
        setPasswordChangeInProgress(false);
      }, 5000); // 5 second delay to ensure auth state stabilizes
    }
  }

  // Show link password modal
  showLinkPasswordModal() {
    const modal = this.createModal(
      "Link Email/Password",
      `
      <div class="modal-form">
        <p>Add email/password authentication to your account for additional security.</p>
        <div class="form-group">
          <label for="linkPassword">Password</label>
          <input type="password" id="linkPassword" placeholder="Enter password" minlength="6">
        </div>
        <div class="form-group">
          <label for="confirmLinkPassword">Confirm Password</label>
          <input type="password" id="confirmLinkPassword" placeholder="Confirm password">
        </div>
        <div class="modal-actions">
          <button class="action-btn secondary-btn" onclick="this.closest('.modal').remove()">Cancel</button>
          <button class="action-btn primary-btn" id="confirmLinkPasswordBtn">Link Password</button>
        </div>
      </div>
    `
    );

    const confirmBtn = modal.querySelector("#confirmLinkPasswordBtn");
    confirmBtn.addEventListener("click", () => {
      this.handleLinkPasswordConfirm(modal);
    });
  }

  async handleLinkPasswordConfirm(modal) {
    const password = modal.querySelector("#linkPassword").value;
    const confirmPassword = modal.querySelector("#confirmLinkPassword").value;

    // Import the flag setter
    const { setPasswordChangeInProgress } = await import("../firebase/auth.js");

    try {
      this.view.setLoading(true, "Linking password to account...");

      // Store current user data before password link
      const currentUserData = {
        user: this.model.getCurrentUser(),
        backendUser: this.model.getBackendUser(),
      };

      // Set flag to prevent logout during password link and store user data
      setPasswordChangeInProgress(true, currentUserData);

      const result = await this.model.linkPassword(password, confirmPassword);

      if (result.success) {
        modal.remove();
        const linkPasswordSection = this.view.findElement(
          "#linkPasswordSection"
        );
        if (linkPasswordSection) {
          linkPasswordSection.style.display = "none";
        }

        // Hide password warning since user now has password
        const passwordWarning = this.view.findElement("#passwordWarning");
        if (passwordWarning) {
          passwordWarning.style.display = "none";
        }

        // Show success popup modal instead of regular message
        this.showSuccessPopup(
          "Password Linked Successfully",
          "Email/password authentication has been linked to your account successfully. You can now use email and password to log in."
        );

        // Update user data if the API returned updated user info
        if (result.user) {
          // Update UI with available data
          this.view.updateUserData(this.model.getCurrentUser(), result.user);
          this.notifyProfileUpdate(this.model.getCurrentUser(), result.user);
        }
      } else {
        this.view.showError(result.error);
      }
    } catch (error) {
      console.error("Error linking password:", error);
      this.view.showError("Failed to link password. Please try again.");
    } finally {
      this.view.setLoading(false);

      // Clear the flag after a longer delay to allow auth state to stabilize
      setTimeout(() => {
        setPasswordChangeInProgress(false);
      }, 5000); // 5 second delay to ensure auth state stabilizes
    }
  }

  // Show delete account modal
  showDeleteAccountModal() {
    const modal = this.createModal(
      "Delete Account",
      `
      <div class="modal-form">
        <div class="warning-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>Warning: This action cannot be undone!</h4>
          <p>Deleting your account will permanently remove all your data, including:</p>
          <ul>
            <li>Profile information</li>
            <li>Scan history</li>
            <li>All associated data</li>
          </ul>
        </div>
        <div class="form-group">
          <label for="confirmDelete">Type "DELETE" to confirm</label>
          <input type="text" id="confirmDelete" placeholder="Type DELETE">
        </div>
        <div class="modal-actions">
          <button class="action-btn secondary-btn" onclick="this.closest('.modal').remove()">Cancel</button>
          <button class="action-btn danger-btn" id="confirmDeleteAccount">Delete Account</button>
        </div>
      </div>
    `
    );

    const confirmBtn = modal.querySelector("#confirmDeleteAccount");
    confirmBtn.addEventListener("click", () => {
      this.handleDeleteAccountConfirm(modal);
    });
  }

  async handleDeleteAccountConfirm(modal) {
    const confirmText = modal.querySelector("#confirmDelete").value;

    try {
      this.view.setLoading(true, "Deleting account...");

      const result = await this.model.deleteAccount(confirmText);

      if (result.success) {
        modal.remove();
        this.view.showSuccess("Account deleted successfully");

        // Redirect to home page after successful deletion
        setTimeout(() => {
          this.navigate("home");
          window.location.reload();
        }, 2000);
      } else {
        this.view.showError(result.error);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      this.view.showError("Failed to delete account. Please try again.");
    } finally {
      this.view.setLoading(false);
    }
  }

  // Create modal helper
  createModal(title, content) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="this.closest('.modal').remove()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  // Show success popup modal
  showSuccessPopup(title, message) {
    const modal = this.createModal(
      title,
      `
      <div class="success-popup">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="success-message">
          <p>${message}</p>
        </div>
        <div class="modal-actions">
          <button class="action-btn primary-btn" onclick="this.closest('.modal').remove()">OK</button>
        </div>
      </div>
    `
    );

    // Set modal width for success popup
    modal.querySelector(".modal-content").style.maxWidth = "400px";

    return modal;
  }

  // Update user data from external source (e.g., auth state change)
  updateUserData(currentUser, backendUser) {
    this.model.updateUserData(currentUser, backendUser);
    this.view.updateUserData(currentUser, backendUser);
  }

  // Update method called when model data changes
  onUpdate(data) {
    if (data.key === "isLoading") {
      this.view.setLoading(data.value);
    } else if (data.key === "backendUser") {
      this.view.updateUserData(this.model.getCurrentUser(), data.value);
    }
  }

  // Notify the main app about profile updates
  notifyProfileUpdate(currentUser, backendUser) {
    // Dispatch a custom event that the main app can listen to
    const profileUpdateEvent = new CustomEvent("profileUpdated", {
      detail: {
        currentUser,
        backendUser,
      },
    });
    document.dispatchEvent(profileUpdateEvent);
  }
}
