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
        <div class="profile-header">
          <h1>User Profile</h1>
          <button class="back-btn" id="backToHome">
            <i class="fas fa-arrow-left"></i> Back to Home
          </button>
        </div>

        <div class="profile-content">
          <!-- Profile Information Card -->
          <div class="profile-card">
            <div class="profile-image-section">
              <div class="profile-image-container">
                <img src="./src/assets/default-avatar.svg" alt="Profile" class="profile-image-page" id="profileImage">
                <div class="image-overlay">
                  <i class="fas fa-camera"></i>
                  <span>Change Photo</span>
                </div>
              </div>
              <input type="file" id="imageUpload" accept="image/*" style="display: none;">
            </div>

            <div class="profile-info">
              <div class="info-group">
                <label>Username</label>
                <div class="input-group">
                  <input type="text" id="username" readonly>
                  <button class="edit-btn" data-field="username">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>

              <div class="info-group">
                <label>Email</label>
                <div class="input-group">
                  <input type="email" id="email" readonly>
                  <span class="readonly-indicator">Cannot be changed</span>
                </div>
              </div>

              <div class="info-group">
                <label>Birth Date</label>
                <div class="input-group">
                  <input type="date" id="birthdate" readonly>
                  <button class="edit-btn" data-field="birthdate">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>

              <div class="info-group">
                <label>Member Since</label>
                <div class="input-group">
                  <input type="text" id="createdAt" readonly>
                  <span class="readonly-indicator">Account creation date</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="profile-actions">
            <button class="action-btn save-btn" id="saveProfile" style="display: none;">
              <i class="fas fa-save"></i> Save Changes
            </button>
            <button class="action-btn cancel-btn" id="cancelEdit" style="display: none;">
              <i class="fas fa-times"></i> Cancel
            </button>
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

            <div class="security-item" id="linkPasswordSection" style="display: none;">
              <div class="security-info">
                <h4>Link Email/Password</h4>
                <p>Add email/password authentication to your account</p>
              </div>
              <button class="action-btn secondary-btn" id="linkPassword">
                <i class="fas fa-link"></i> Link Password
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

    // Profile image click
    const imageContainer = this.findElement(".profile-image-container");
    if (imageContainer) {
      this.addEventListener(imageContainer, "click", () => {
        const imageUpload = this.findElement("#imageUpload");
        if (imageUpload) imageUpload.click();
      });
    }

    // Edit buttons
    const editBtns = this.findElements(".edit-btn");
    editBtns.forEach((btn) => {
      this.addEventListener(btn, "click", () => {
        const field = btn.dataset.field;
        this.onEditField(field);
      });
    });

    // Save and cancel buttons
    const saveBtn = this.findElement("#saveProfile");
    const cancelBtn = this.findElement("#cancelEdit");

    if (saveBtn) {
      this.addEventListener(saveBtn, "click", () => {
        this.onSaveProfile();
      });
    }

    if (cancelBtn) {
      this.addEventListener(cancelBtn, "click", () => {
        this.onCancelEdit();
      });
    }

    // Security actions
    const changePasswordBtn = this.findElement("#changePassword");
    const linkPasswordBtn = this.findElement("#linkPassword");
    const deleteAccountBtn = this.findElement("#deleteAccount");

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

  onEditField(field) {
    this.enableEdit(field);
  }

  onSaveProfile() {
    const formData = this.getFormData();
    this.notifyPresenter("saveProfile", formData);
  }

  onCancelEdit() {
    this.cancelEdit();
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

    // Populate form fields
    const username =
      this.backendUser?.username || this.currentUser.displayName || "";
    const email = this.backendUser?.email || this.currentUser.email || "";

    const usernameField = this.findElement("#username");
    const emailField = this.findElement("#email");

    if (usernameField) usernameField.value = username;
    if (emailField) emailField.value = email;

    // Format birthdate
    if (this.backendUser?.birthdate) {
      const date = new Date(this.backendUser.birthdate);
      const birthdateField = this.findElement("#birthdate");
      if (birthdateField) {
        birthdateField.value = date.toISOString().split("T")[0];
      }
    }

    // Format creation date
    if (this.backendUser?.createdAt) {
      const date = new Date(this.backendUser.createdAt);
      const createdAtField = this.findElement("#createdAt");
      if (createdAtField) {
        createdAtField.value = date.toLocaleDateString();
      }
    }

    // Show link password option for Google users
    const providers = this.currentUser.providerData.map((p) => p.providerId);
    if (providers.includes("google.com") && !providers.includes("password")) {
      const linkPasswordSection = this.findElement("#linkPasswordSection");
      if (linkPasswordSection) {
        linkPasswordSection.style.display = "block";
      }
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

  // Enable editing for a field
  enableEdit(field) {
    const input = this.findElement(`#${field}`);
    const editBtn = this.findElement(`[data-field="${field}"]`);

    if (input) {
      input.removeAttribute("readonly");
      input.focus();
    }

    if (editBtn) {
      editBtn.style.display = "none";
    }

    // Show save and cancel buttons
    const saveBtn = this.findElement("#saveProfile");
    const cancelBtn = this.findElement("#cancelEdit");

    if (saveBtn) saveBtn.style.display = "inline-block";
    if (cancelBtn) cancelBtn.style.display = "inline-block";
  }

  // Cancel editing
  cancelEdit() {
    // Reset all fields to readonly
    const editableFields = ["username", "birthdate"];
    editableFields.forEach((field) => {
      const input = this.findElement(`#${field}`);
      if (input) {
        input.setAttribute("readonly", true);
      }
    });

    // Show edit buttons
    const editBtns = this.findElements(".edit-btn");
    editBtns.forEach((btn) => {
      btn.style.display = "inline-block";
    });

    // Hide save and cancel buttons
    const saveBtn = this.findElement("#saveProfile");
    const cancelBtn = this.findElement("#cancelEdit");

    if (saveBtn) saveBtn.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "none";

    // Restore original values
    this.populateProfile();
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
