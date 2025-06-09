// Profile View for displaying the user profile page
import BaseView from "./BaseView.js";

export default class ProfileView extends BaseView {
  constructor() {
    // Use existing profile section or create one in main element
    super("profile");
    this.createProfileSection();
    this.isLoading = false;
    this.currentUser = null;
    this.backendUser = null;
    this.init();
  }

  createProfileSection() {
    // Check if profile section already exists
    this.container = document.getElementById("profile");

    if (!this.container) {
      // Create profile section and add it to main element, not body
      this.container = document.createElement("section");
      this.container.id = "profile";
      this.container.className = "section profile-section";
      this.container.style.display = "none";

      // Append to main element instead of body to maintain proper layout
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.appendChild(this.container);
      } else {
        // Fallback to body if main not found
        document.body.appendChild(this.container);
      }
    }
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const html = `
      <div class="profile-container">
        <!-- Clean Header -->

        <!-- Main Profile Content Wrapper -->
        <div class="profile-main-content">
          <!-- Profile Picture Section -->
          <div class="profile-picture-section">
          <div class="header-content">
            <h1>Profile</h1>
            <p class="header-subtitle">Settings for your personal profile</p>
          </div>
            <br>
            <div class="picture-container">
              <div class="profile-image-container">
                <img src="./src/assets/default-avatar.svg" alt="Profile" class="profile-image-page" id="profileImage">
                <div class="image-overlay">
                  <i class="fas fa-camera"></i>
                  <span>Change Photo</span>
                </div>
              </div>
              <div class="picture-info">
                <div class="picture-details">
                  <h4 id="profileNameDisplay">User Name</h4>
                  <p class="picture-role">Workspace admin</p>
                </div>
                <button class="upload-btn" id="uploadPhotoBtn">
                  <i class="fas fa-upload"></i> Upload photo
                </button>
              </div>
            </div>
            <input type="file" id="imageUpload" accept="image/*" style="display: none;">
          </div>

          <!-- Google Account Notice -->
          <div class="google-notice" id="googleNotice" style="display: none;">
            <div class="notice-content">
              <i class="fab fa-google"></i>
              <span>This account is connected to your Google account. Your details can only be changed from the Google account.</span>
            </div>
          </div>

          <!-- Password Warning Notice -->
          <div class="password-warning" id="passwordWarning" style="display: none;">
            <div class="warning-content">
              <i class="fas fa-exclamation-triangle"></i>
              <span>Your account doesn't have a password set. Consider adding a password for additional security.</span>
              <button class="warning-action-btn" id="setPasswordBtn">
                <i class="fas fa-key"></i> Set Password
              </button>
            </div>
          </div>

          <!-- Profile Information Section -->
          <div class="profile-info-section">
            <div class="section-header">
              <div class="section-title">
                <h3>Profile Information</h3>
                <p>Manage your personal information</p>
              </div>
              <!-- Profile Actions -->
              <div class="section-actions">
                <!-- View Mode Actions -->
                <div id="profileViewActions">
                  <button class="action-btn primary-btn" id="editProfileBtn">
                    <i class="fas fa-edit"></i> Edit Profile
                  </button>
                </div>
                <!-- Edit Mode Actions -->
                <div id="profileEditActions" style="display: none;">
                  <button class="action-btn cancel-btn" id="cancelEditSection">
                    <i class="fas fa-times"></i> Cancel
                  </button>
                  <button class="action-btn save-btn" id="saveProfileSection">
                    <i class="fas fa-save"></i> Save
                  </button>
                </div>
              </div>
            </div>

            <div class="profile-content">
              <!-- Profile View Mode -->
              <div class="profile-info" id="profileViewMode">
                <div class="info-group">
                  <label>Username</label>
                  <div class="info-display">
                    <span class="info-value" id="usernameDisplay">-</span>
                  </div>
                </div>

                <div class="info-group">
                  <label>Email</label>
                  <div class="info-display">
                    <span class="info-value" id="emailDisplay">-</span>
                    <span class="readonly-indicator">Cannot be changed</span>
                  </div>
                </div>

                <div class="info-group">
                  <label>Birth Date</label>
                  <div class="info-display">
                    <span class="info-value" id="birthdateDisplay">-</span>
                  </div>
                </div>

                <div class="info-group">
                  <label>Member Since</label>
                  <div class="info-display">
                    <span class="info-value" id="createdAtDisplay">-</span>
                    <span class="readonly-indicator">Account creation date</span>
                  </div>
                </div>
              </div>

              <!-- Profile Edit Mode -->
              <div class="profile-info" id="profileEditMode" style="display: none;">
                <div class="info-group">
                  <label>Username</label>
                  <div class="input-group">
                    <input type="text" id="username" placeholder="Enter your username">
                  </div>
                </div>

                <div class="info-group">
                  <label>Email</label>
                  <div class="info-display">
                    <span class="info-value" id="emailDisplayEdit">-</span>
                    <span class="readonly-indicator">Cannot be changed</span>
                  </div>
                </div>

                <div class="info-group">
                  <label>Birth Date</label>
                  <div class="input-group">
                    <input type="date" id="birthdate">
                  </div>
                </div>

                <div class="info-group">
                  <label>Member Since</label>
                  <div class="info-display">
                    <span class="info-value" id="createdAtDisplayEdit">-</span>
                    <span class="readonly-indicator">Account creation date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <!-- Security Section -->
          <div class="security-card">
            <h3>Security Settings</h3>

            <div class="security-item">
              <div class="security-info">
                <h4>Password</h4>
                <p>Change your account password</p>
              </div>
              <button class="action-btn secondary-btn" id="changePassword">
                <i class="fas fa-key"></i> Change Password
              </button>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="danger-card">
            <h3>Danger Zone</h3>
            <div class="danger-item">
              <div class="danger-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
              </div>
              <button class="action-btn danger-btn" id="deleteAccount">
                <i class="fas fa-trash"></i> Delete Account
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div class="loading-overlay" id="loadingOverlay" style="display: none;">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
          </div>
        </div>

        <!-- Message Container -->
        <div class="message-container" id="messageContainer"></div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    // Back to home button
    const backBtn = this.findElement("#backToHome");
    if (backBtn) {
      this.addEventListener(backBtn, "click", () => {
        this.onBackToHome();
      });
    }

    // Profile image upload
    const imageUpload = this.findElement("#imageUpload");
    if (imageUpload) {
      this.addEventListener(imageUpload, "change", (e) => {
        if (e.target.files[0]) {
          this.onImageUpload(e.target.files[0]);
        }
      });
    }

    // Profile image click and upload button
    const imageContainer = this.findElement(".profile-image-container");
    const uploadPhotoBtn = this.findElement("#uploadPhotoBtn");

    if (imageContainer) {
      this.addEventListener(imageContainer, "click", () => {
        const imageUpload = this.findElement("#imageUpload");
        if (imageUpload) imageUpload.click();
      });
    }

    if (uploadPhotoBtn) {
      this.addEventListener(uploadPhotoBtn, "click", () => {
        const imageUpload = this.findElement("#imageUpload");
        if (imageUpload) imageUpload.click();
      });
    }

    // Edit Profile button
    const editProfileBtn = this.findElement("#editProfileBtn");
    if (editProfileBtn) {
      this.addEventListener(editProfileBtn, "click", () => {
        this.onEditProfile();
      });
    }

    // Header save and cancel buttons
    const saveHeaderBtn = this.findElement("#saveProfileHeader");
    const cancelHeaderBtn = this.findElement("#cancelEditHeader");

    if (saveHeaderBtn) {
      this.addEventListener(saveHeaderBtn, "click", () => {
        this.onSaveProfile();
      });
    }

    if (cancelHeaderBtn) {
      this.addEventListener(cancelHeaderBtn, "click", () => {
        this.onCancelEdit();
      });
    }

    // Section save and cancel buttons
    const saveSectionBtn = this.findElement("#saveProfileSection");
    const cancelSectionBtn = this.findElement("#cancelEditSection");

    if (saveSectionBtn) {
      this.addEventListener(saveSectionBtn, "click", () => {
        this.onSaveProfile();
      });
    }

    if (cancelSectionBtn) {
      this.addEventListener(cancelSectionBtn, "click", () => {
        this.onCancelEdit();
      });
    }

    // Security actions
    const changePasswordBtn = this.findElement("#changePassword");
    const linkPasswordBtn = this.findElement("#linkPassword");
    const deleteAccountBtn = this.findElement("#deleteAccount");
    const setPasswordBtn = this.findElement("#setPasswordBtn");

    if (changePasswordBtn) {
      this.addEventListener(changePasswordBtn, "click", () => {
        this.onChangePassword();
      });
    }

    if (linkPasswordBtn) {
      this.addEventListener(linkPasswordBtn, "click", () => {
        this.onLinkPassword();
      });
    }

    if (setPasswordBtn) {
      this.addEventListener(setPasswordBtn, "click", () => {
        this.onLinkPassword();
      });
    }

    if (deleteAccountBtn) {
      this.addEventListener(deleteAccountBtn, "click", () => {
        this.onDeleteAccount();
      });
    }
  }

  // Event handler methods
  onBackToHome() {
    this.notifyPresenter("backToHome");
  }

  onImageUpload(file) {
    this.notifyPresenter("imageUpload", { file });
  }

  onEditProfile() {
    this.switchToEditMode();
  }

  onSaveProfile() {
    const formData = this.getFormData();
    this.notifyPresenter("saveProfile", formData);
  }

  onCancelEdit() {
    this.switchToViewMode();
  }

  onChangePassword() {
    this.notifyPresenter("changePassword");
  }

  onLinkPassword() {
    this.notifyPresenter("linkPassword");
  }

  onDeleteAccount() {
    this.notifyPresenter("deleteAccount");
  }

  // Method to notify presenter of user actions
  notifyPresenter(action, data = {}) {
    if (
      this.presenter &&
      typeof this.presenter.handleUserAction === "function"
    ) {
      this.presenter.handleUserAction(action, data);
    }
  }

  // Method to set presenter reference
  setPresenter(presenter) {
    this.presenter = presenter;
  }

  // Update user data
  updateUserData(currentUser, backendUser) {
    this.currentUser = currentUser;
    this.backendUser = backendUser;
    this.populateProfile();
  }

  // Populate profile with user data
  populateProfile() {
    if (!this.currentUser) return;

    // Populate profile image
    const profileImage = this.findElement("#profileImage");
    if (profileImage) {
      this.setProfileImage(profileImage);
    }

    // Prepare data
    const username =
      this.backendUser?.username || this.currentUser.displayName || "";
    const email = this.backendUser?.email || this.currentUser.email || "";

    let birthdateFormatted = "";
    let birthdateValue = "";
    if (this.backendUser?.birthdate) {
      const date = new Date(this.backendUser.birthdate);
      birthdateFormatted = date.toLocaleDateString();
      birthdateValue = date.toISOString().split("T")[0];
    }

    let createdAtFormatted = "";
    if (this.backendUser?.createdAt) {
      const date = new Date(this.backendUser.createdAt);
      createdAtFormatted = date.toLocaleDateString();
    }

    // Populate profile name in picture section
    this.setElementText("#profileNameDisplay", username || "User Name");

    // Populate view mode displays
    this.setElementText("#usernameDisplay", username || "Not set");
    this.setElementText("#emailDisplay", email);
    this.setElementText("#birthdateDisplay", birthdateFormatted || "Not set");
    this.setElementText("#createdAtDisplay", createdAtFormatted);

    // Populate edit mode displays (for readonly fields)
    this.setElementText("#emailDisplayEdit", email);
    this.setElementText("#createdAtDisplayEdit", createdAtFormatted);

    // Populate edit mode inputs
    const usernameInput = this.findElement("#username");
    const birthdateInput = this.findElement("#birthdate");

    if (usernameInput) usernameInput.value = username;
    if (birthdateInput) birthdateInput.value = birthdateValue;

    // Show Google notice and link password option for Google users
    const providers = this.currentUser.providerData.map((p) => p.providerId);
    const hasPassword = providers.includes("password");

    if (providers.includes("google.com")) {
      const googleNotice = this.findElement("#googleNotice");
      if (googleNotice) {
        googleNotice.style.display = "block";
      }

      if (!hasPassword) {
        const linkPasswordSection = this.findElement("#linkPasswordSection");
        if (linkPasswordSection) {
          linkPasswordSection.style.display = "block";
        }
      }
    }

    // Show password warning if user doesn't have password authentication
    const passwordWarning = this.findElement("#passwordWarning");
    if (passwordWarning) {
      passwordWarning.style.display = hasPassword ? "none" : "block";
    }
  }

  // Helper method to set element text content
  setElementText(selector, text) {
    const element = this.findElement(selector);
    if (element) {
      element.textContent = text;
    }
  }

  // Set profile image with fallback
  setProfileImage(imageElement) {
    let imageUrl = "./src/assets/default-avatar.svg";

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

    console.log("Setting profile image URL:", imageUrl);
    imageElement.src = imageUrl;

    // Add error handler to fallback to default avatar
    imageElement.onerror = () => {
      console.warn("Failed to load profile image, using default avatar");
      imageElement.src = "./src/assets/default-avatar.svg";
      imageElement.onerror = null; // Prevent infinite loop
    };
  }

  // Switch to edit mode
  switchToEditMode() {
    // Content modes
    const viewMode = this.findElement("#profileViewMode");
    const editMode = this.findElement("#profileEditMode");

    // Section actions
    const profileViewActions = this.findElement("#profileViewActions");
    const profileEditActions = this.findElement("#profileEditActions");

    // Header actions
    const viewModeActions = this.findElement("#viewModeActions");
    const editModeHeaderActions = this.findElement("#editModeHeaderActions");

    if (viewMode) viewMode.style.display = "none";
    if (editMode) editMode.style.display = "flex";

    if (profileViewActions) profileViewActions.style.display = "none";
    if (profileEditActions) profileEditActions.style.display = "flex";

    if (viewModeActions) viewModeActions.style.display = "none";
    if (editModeHeaderActions) editModeHeaderActions.style.display = "flex";
  }

  // Switch to view mode
  switchToViewMode() {
    // Content modes
    const viewMode = this.findElement("#profileViewMode");
    const editMode = this.findElement("#profileEditMode");

    // Section actions
    const profileViewActions = this.findElement("#profileViewActions");
    const profileEditActions = this.findElement("#profileEditActions");

    // Header actions
    const viewModeActions = this.findElement("#viewModeActions");
    const editModeHeaderActions = this.findElement("#editModeHeaderActions");

    if (viewMode) viewMode.style.display = "flex";
    if (editMode) editMode.style.display = "none";

    if (profileViewActions) profileViewActions.style.display = "flex";
    if (profileEditActions) profileEditActions.style.display = "none";

    if (viewModeActions) viewModeActions.style.display = "block";
    if (editModeHeaderActions) editModeHeaderActions.style.display = "none";

    // Restore original values
    this.populateProfile();
  }

  // Cancel editing (alias for switchToViewMode)
  cancelEdit() {
    this.switchToViewMode();
  }

  // Get form data
  getFormData() {
    const data = {};

    // Only include username if it has a value
    const username = this.findElement("#username")?.value?.trim();
    if (username) {
      data.username = username;
    }

    // Only include birthdate if it has a value
    const birthdate = this.findElement("#birthdate")?.value?.trim();
    if (birthdate) {
      data.birthdate = birthdate;
    }

    return data;
  }

  // Set loading state
  setLoading(isLoading) {
    this.isLoading = isLoading;
    const loadingOverlay = this.findElement("#loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = isLoading ? "flex" : "none";
    }
  }

  // Show message
  showMessage(message, type = "info") {
    const messageContainer = this.findElement("#messageContainer");
    if (!messageContainer) return;

    // Clear any existing messages of the same type to prevent duplicates
    const existingMessages = messageContainer.querySelectorAll(
      `.message.${type}`
    );
    existingMessages.forEach((msg) => msg.remove());

    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
      <i class="fas fa-${
        type === "error"
          ? "exclamation-circle"
          : type === "success"
          ? "check-circle"
          : "info-circle"
      }"></i>
      <span>${message}</span>
      <button class="message-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    messageContainer.appendChild(messageElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageElement.parentElement) {
        messageElement.remove();
      }
    }, 5000);
  }

  // Show error message
  showError(message) {
    this.showMessage(message, "error");
  }

  // Show success message
  showSuccess(message) {
    this.showMessage(message, "success");
  }

  // Method to call after successful save
  onSaveSuccess() {
    this.switchToViewMode();
  }

  // Show the profile view
  show() {
    if (this.container) {
      // Hide all other sections
      document.querySelectorAll("section.section").forEach((section) => {
        if (section.id !== "profile") {
          section.style.display = "none";
        }
      });

      // Show profile section
      this.container.style.display = "block";
      this.isVisible = true;

      // Scroll to top
      window.scrollTo(0, 0);

      this.onShow();
    }
  }

  // Hide the profile view
  hide() {
    if (this.container) {
      this.container.style.display = "none";
      this.isVisible = false;
      this.onHide();
    }
  }

  onShow() {
    // Load user profile when shown
    this.notifyPresenter("loadProfile");
  }

  onHide() {
    // Cancel any ongoing edits when hidden
    this.cancelEdit();
  }
}
