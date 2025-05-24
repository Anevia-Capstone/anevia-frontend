// User Profile component for displaying user info and logout option
import { logoutUser } from "../firebase/auth.js";

export default class UserProfile {
  constructor(navigation) {
    this.navigation = navigation;
    this.currentUser = null;
    this.dropdownVisible = false;

    // Create the profile container
    this.profileContainer = document.createElement("div");
    this.profileContainer.className = "user-profile-container";
    this.profileContainer.style.display = "none"; // Initially hidden

    // Add to navigation - for desktop
    const navRight = this.navigation.querySelector(".nav-right");
    const desktopLoginBtn = this.navigation.querySelector(
      ".desktop-only.login-btn"
    );

    // Insert the profile container in the nav-right div
    if (navRight) {
      // Insert before the login button if it exists
      if (desktopLoginBtn) {
        navRight.insertBefore(this.profileContainer, desktopLoginBtn);
        this.desktopLoginBtn = desktopLoginBtn; // Store reference
      } else {
        // If button not found, append to nav-right
        navRight.appendChild(this.profileContainer);
      }
    } else {
      // Fallback if nav-right not found
      console.log("Nav-right not found, using fallback");
      const navbar = this.navigation.querySelector(".navbar");
      navbar.appendChild(this.profileContainer);
    }

    // Also handle mobile login button
    const mobileLoginBtn = this.navigation.querySelector(
      ".mobile-login .login-btn"
    );
    if (mobileLoginBtn) {
      this.mobileProfileContainer = document.createElement("div");
      this.mobileProfileContainer.className = "user-profile-container mobile";
      this.mobileProfileContainer.style.display = "none";

      // Insert before instead of replacing
      mobileLoginBtn.parentNode.insertBefore(
        this.mobileProfileContainer,
        mobileLoginBtn
      );
      this.mobileLoginBtn = mobileLoginBtn; // Store reference
    }

    this.render();
    this.setupEventListeners();
  }

  render() {
    // Main profile container content
    this.profileContainer.innerHTML = `
      <div class="profile-button">
        <img src="./src/assets/default-avatar.svg" alt="Profile" class="profile-image">
        <i class="fas fa-chevron-down profile-arrow"></i>
      </div>
      <div class="profile-dropdown">
        <div class="dropdown-header">
          <img src="./src/assets/default-avatar.svg" alt="Profile" class="dropdown-profile-image">
          <div class="dropdown-user-info">
            <span class="dropdown-user-name">User</span>
            <span class="dropdown-user-email">user@example.com</span>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <ul class="dropdown-menu">
          <li class="dropdown-item profile-btn">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </li>
          <li class="dropdown-item logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </li>
        </ul>
      </div>
    `;

    // Mobile profile container content (simplified)
    if (this.mobileProfileContainer) {
      this.mobileProfileContainer.innerHTML = `
        <div class="profile-button mobile">
          <img src="./src/assets/default-avatar.svg" alt="Profile" class="profile-image">
        </div>
        <div class="profile-dropdown mobile">
          <div class="dropdown-header">
            <img src="./src/assets/default-avatar.svg" alt="Profile" class="dropdown-profile-image">
            <div class="dropdown-user-info">
              <span class="dropdown-user-name">User</span>
              <span class="dropdown-user-email">user@example.com</span>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <ul class="dropdown-menu">
            <li class="dropdown-item profile-btn">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </li>
            <li class="dropdown-item logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </li>
          </ul>
        </div>
      `;
    }
  }

  setupEventListeners() {
    // Toggle dropdown on profile button click
    const profileButton =
      this.profileContainer.querySelector(".profile-button");
    profileButton.addEventListener("click", () => {
      this.toggleDropdown();
    });

    // Handle profile button click
    const profileBtn = this.profileContainer.querySelector(".profile-btn");
    profileBtn.addEventListener("click", () => {
      this.handleProfileClick();
    });

    // Handle logout button click
    const logoutBtn = this.profileContainer.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", () => {
      this.handleLogout();
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !this.profileContainer.contains(event.target) &&
        this.dropdownVisible
      ) {
        this.hideDropdown();
      }
    });

    // Setup mobile profile events if it exists
    if (this.mobileProfileContainer) {
      const mobileProfileButton =
        this.mobileProfileContainer.querySelector(".profile-button");
      mobileProfileButton.addEventListener("click", () => {
        this.toggleMobileDropdown();
      });

      const mobileProfileBtn =
        this.mobileProfileContainer.querySelector(".profile-btn");
      mobileProfileBtn.addEventListener("click", () => {
        this.handleProfileClick();
      });

      const mobileLogoutBtn =
        this.mobileProfileContainer.querySelector(".logout-btn");
      mobileLogoutBtn.addEventListener("click", () => {
        this.handleLogout();
      });

      document.addEventListener("click", (event) => {
        if (
          !this.mobileProfileContainer.contains(event.target) &&
          this.mobileDropdownVisible
        ) {
          this.hideMobileDropdown();
        }
      });
    }
  }

  toggleDropdown() {
    const dropdown = this.profileContainer.querySelector(".profile-dropdown");
    this.dropdownVisible = !this.dropdownVisible;

    if (this.dropdownVisible) {
      dropdown.classList.add("active");
    } else {
      dropdown.classList.remove("active");
    }
  }

  hideDropdown() {
    const dropdown = this.profileContainer.querySelector(".profile-dropdown");
    dropdown.classList.remove("active");
    this.dropdownVisible = false;
  }

  toggleMobileDropdown() {
    if (!this.mobileProfileContainer) return;

    const dropdown =
      this.mobileProfileContainer.querySelector(".profile-dropdown");
    this.mobileDropdownVisible = !this.mobileDropdownVisible;

    if (this.mobileDropdownVisible) {
      dropdown.classList.add("active");
    } else {
      dropdown.classList.remove("active");
    }
  }

  hideMobileDropdown() {
    if (!this.mobileProfileContainer) return;

    const dropdown =
      this.mobileProfileContainer.querySelector(".profile-dropdown");
    dropdown.classList.remove("active");
    this.mobileDropdownVisible = false;
  }

  handleProfileClick() {
    // Hide dropdown
    this.hideDropdown();
    this.hideMobileDropdown();

    // Dispatch custom event to show profile page
    const profileEvent = new CustomEvent("showProfile");
    document.dispatchEvent(profileEvent);
  }

  async handleLogout() {
    try {
      const result = await logoutUser();
      if (result.success) {
        console.log("Logged out successfully");
        // Reload page to update UI
        window.location.reload();
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  updateUserInfo(user) {
    this.currentUser = user;

    if (!user) {
      // Hide profile containers
      this.profileContainer.style.display = "none";
      if (this.mobileProfileContainer) {
        this.mobileProfileContainer.style.display = "none";
      }

      // Show login buttons
      if (this.desktopLoginBtn) {
        this.desktopLoginBtn.style.display = "";
      }
      if (this.mobileLoginBtn) {
        this.mobileLoginBtn.style.display = "";
      }
      return;
    }

    // Show profile containers
    this.profileContainer.style.display = "flex";
    if (this.mobileProfileContainer) {
      this.mobileProfileContainer.style.display = "flex";
    }

    // Hide login buttons
    if (this.desktopLoginBtn) {
      this.desktopLoginBtn.style.display = "none";
    }
    if (this.mobileLoginBtn) {
      this.mobileLoginBtn.style.display = "none";
    }

    console.log("Updating user profile with:", user);
    console.log("User photo URL:", user.photoURL);

    // Update profile image and name
    const profileImage = this.profileContainer.querySelector(".profile-image");

    const dropdownProfileImage = this.profileContainer.querySelector(
      ".dropdown-profile-image"
    );
    const dropdownUserName = this.profileContainer.querySelector(
      ".dropdown-user-name"
    );
    const dropdownUserEmail = this.profileContainer.querySelector(
      ".dropdown-user-email"
    );

    // Set profile image with better handling
    this.setUserProfileImage(profileImage, user);
    this.setUserProfileImage(dropdownProfileImage, user);

    // Set user name and email
    const displayName = user.displayName || user.email.split("@")[0];
    dropdownUserName.textContent = displayName;
    dropdownUserEmail.textContent = user.email;

    // Update mobile profile if it exists
    if (this.mobileProfileContainer) {
      const mobileProfileImage =
        this.mobileProfileContainer.querySelector(".profile-image");
      const mobileDropdownProfileImage =
        this.mobileProfileContainer.querySelector(".dropdown-profile-image");
      const mobileDropdownUserName = this.mobileProfileContainer.querySelector(
        ".dropdown-user-name"
      );
      const mobileDropdownUserEmail = this.mobileProfileContainer.querySelector(
        ".dropdown-user-email"
      );

      // Update mobile profile images with better handling
      this.setUserProfileImage(mobileProfileImage, user);
      this.setUserProfileImage(mobileDropdownProfileImage, user);
      mobileDropdownUserName.textContent = displayName;
      mobileDropdownUserEmail.textContent = user.email;
    }
  }

  setUserProfileImage(imageElement, user) {
    let photoURL = "./src/assets/default-avatar.svg";

    // Priority: user.photoURL > provider photoURL > default
    if (user.photoURL) {
      photoURL = user.photoURL;
      console.log("Using user profile photo:", photoURL);
    } else if (user.providerData && user.providerData.length > 0) {
      // Try to get photo from provider data
      for (const provider of user.providerData) {
        if (provider.photoURL) {
          photoURL = provider.photoURL;
          console.log("Using provider photo URL:", photoURL);
          break;
        }
      }
    }

    // Set image with error handling
    imageElement.src = photoURL;

    // Add error handler to fallback to default avatar if image fails to load
    imageElement.onerror = () => {
      console.warn("Failed to load profile image, using default avatar");
      imageElement.src = "./src/assets/default-avatar.svg";
      imageElement.onerror = null; // Prevent infinite loop
    };

    console.log("Updated profile image:", photoURL);
  }
}
