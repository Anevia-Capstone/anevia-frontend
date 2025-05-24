// Register View for displaying the registration page
import BaseView from './BaseView.js';

export default class RegisterView extends BaseView {
  constructor() {
    // Create a new section for register since it's not in the main HTML
    super(null);
    this.createRegisterSection();
    this.isLoading = false;
    this.init();
  }

  createRegisterSection() {
    this.container = document.createElement('section');
    this.container.id = 'register';
    this.container.className = 'section register-section';
    this.container.style.display = 'none';

    // Insert register section after the header
    const header = document.getElementById('header');
    header.parentNode.insertBefore(this.container, header.nextSibling);
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const html = `
      <div class="register-container">
        <div class="register-content">
          <div class="register-left-content">
            <div class="register-main-content">
              <h1 class="register-title">Sign up</h1>
              <div class="register-form-content">
                <div class="register-field">
                  <label for="register-username">Username</label>
                  <input type="text" id="register-username" name="username" placeholder="">
                </div>
                <div class="register-field">
                  <label for="register-email">Email</label>
                  <input type="email" id="register-email" name="email" placeholder="">
                </div>
                <div class="register-field">
                  <label for="register-password">Password</label>
                  <input type="password" id="register-password" name="password" placeholder="">
                </div>
                <button class="sign-up-btn">Sign Up</button>
                <div class="register-divider">
                  <span class="divider-text">or sign up with google</span>
                </div>
                <div class="register-suggestion">
                  <span>Already have an account?</span>
                  <a href="#" class="signin-link">Sign in</a>
                </div>
                <div class="google-signup">
                  <button class="google-signup-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon">
                    <span>Sign Up with google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="register-right-content">
            <!-- Right side with background image -->
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    // Sign up button
    const signUpBtn = this.findElement('.sign-up-btn');
    if (signUpBtn) {
      this.addEventListener(signUpBtn, 'click', (e) => {
        e.preventDefault();
        this.onSignUp();
      });
    }

    // Google sign up button
    const googleSignUpBtn = this.findElement('.google-signup-btn');
    if (googleSignUpBtn) {
      this.addEventListener(googleSignUpBtn, 'click', (e) => {
        e.preventDefault();
        this.onGoogleSignUp();
      });
    }

    // Sign in link
    const signInLink = this.findElement('.signin-link');
    if (signInLink) {
      this.addEventListener(signInLink, 'click', (e) => {
        e.preventDefault();
        this.onSignInLink();
      });
    }

    // Enter key on form fields
    const fields = ['#register-username', '#register-email', '#register-password'];
    fields.forEach(selector => {
      const field = this.findElement(selector);
      if (field) {
        this.addEventListener(field, 'keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.onSignUp();
          }
        });
      }
    });
  }

  onSignUp() {
    if (this.isLoading) return;

    const formData = this.getFormData();

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      this.showError('Please fill in all fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      this.showError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      this.showError('Password must be at least 6 characters long.');
      return;
    }

    // Notify presenter
    this.notifyPresenter('signUp', formData);
  }

  onGoogleSignUp() {
    if (this.isLoading) return;
    this.notifyPresenter('googleSignUp');
  }

  onSignInLink() {
    this.notifyPresenter('showLogin');
  }

  // Method to notify presenter of user actions
  notifyPresenter(action, data = {}) {
    if (this.presenter && typeof this.presenter.handleUserAction === 'function') {
      this.presenter.handleUserAction(action, data);
    }
  }

  // Method to set presenter reference
  setPresenter(presenter) {
    this.presenter = presenter;
  }

  // Set loading state
  setLoading(isLoading) {
    this.isLoading = isLoading;
    const signUpBtn = this.findElement('.sign-up-btn');
    const googleSignUpBtn = this.findElement('.google-signup-btn');

    if (signUpBtn) {
      if (isLoading) {
        signUpBtn.textContent = 'Signing up...';
        signUpBtn.disabled = true;
      } else {
        signUpBtn.textContent = 'Sign Up';
        signUpBtn.disabled = false;
      }
    }

    if (googleSignUpBtn) {
      googleSignUpBtn.disabled = isLoading;
    }
  }

  // Show error message
  showError(message) {
    this.removeStatusMessage();

    const messageElement = document.createElement('div');
    messageElement.className = 'register-message error';
    messageElement.textContent = message;

    const formContent = this.findElement('.register-form-content');
    const divider = this.findElement('.register-divider');
    
    if (formContent && divider) {
      formContent.insertBefore(messageElement, divider);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => this.removeStatusMessage(), 5000);
  }

  // Show success message
  showSuccess(message) {
    this.removeStatusMessage();

    const messageElement = document.createElement('div');
    messageElement.className = 'register-message success';
    messageElement.textContent = message;

    const formContent = this.findElement('.register-form-content');
    const divider = this.findElement('.register-divider');
    
    if (formContent && divider) {
      formContent.insertBefore(messageElement, divider);
    }
  }

  // Remove status message
  removeStatusMessage() {
    const existingMessage = this.findElement('.register-message');
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  // Clear form fields
  clearForm() {
    const fields = ['#register-username', '#register-email', '#register-password'];
    fields.forEach(selector => {
      const field = this.findElement(selector);
      if (field) field.value = '';
    });
  }

  // Get form data
  getFormData() {
    return {
      username: this.findElement('#register-username')?.value || '',
      email: this.findElement('#register-email')?.value || '',
      password: this.findElement('#register-password')?.value || ''
    };
  }

  // Show the register view
  show() {
    if (this.container) {
      // Hide all other sections
      document.querySelectorAll('section.section').forEach(section => {
        if (section.id !== 'register') {
          section.style.display = 'none';
        }
      });

      // Show register section
      this.container.style.display = 'flex';
      this.isVisible = true;

      // Add body class for full-page register
      document.body.classList.add('register-page-active');

      // Scroll to top
      window.scrollTo(0, 0);

      this.onShow();
    }
  }

  // Hide the register view
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;

      // Remove body class
      document.body.classList.remove('register-page-active');

      this.onHide();
    }
  }

  onShow() {
    // Focus on username field when shown
    const usernameField = this.findElement('#register-username');
    if (usernameField) {
      setTimeout(() => usernameField.focus(), 100);
    }
  }

  onHide() {
    // Clear any status messages when hidden
    this.removeStatusMessage();
  }
}
