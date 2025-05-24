// Login View for displaying the login page
import BaseView from './BaseView.js';

export default class LoginView extends BaseView {
  constructor() {
    // Create a new section for login since it's not in the main HTML
    super(null);
    this.createLoginSection();
    this.isLoading = false;
    this.init();
  }

  createLoginSection() {
    this.container = document.createElement('section');
    this.container.id = 'login';
    this.container.className = 'section login-section';
    this.container.style.display = 'none';

    // Insert login section after the header
    const header = document.getElementById('header');
    header.parentNode.insertBefore(this.container, header.nextSibling);
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const html = `
      <div class="login-container">
        <div class="login-content">
          <div class="login-left-content">
            <!-- Left side with blue gradient background -->
          </div>
          <div class="login-right-content">
            <div class="login-main-content">
              <h1 class="login-title">Sign in</h1>
              <div class="login-form-content">
                <div class="login-field">
                  <label for="username">Username or Email</label>
                  <input type="text" id="username" name="username" placeholder="">
                </div>
                <div class="login-field">
                  <label for="password">Password</label>
                  <input type="password" id="password" name="password" placeholder="">
                </div>
                <button class="sign-in-btn">Sign In</button>
                <div class="login-divider">
                  <span class="divider-text">or sign in with google</span>
                </div>
                <div class="login-suggestion">
                  <span>Don't have an account?</span>
                  <a href="#" class="signup-link">Sign up</a>
                </div>
                <div class="google-signin">
                  <button class="google-signin-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon">
                    <span>Sign In with google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    // Sign in button
    const signInBtn = this.findElement('.sign-in-btn');
    if (signInBtn) {
      this.addEventListener(signInBtn, 'click', (e) => {
        e.preventDefault();
        this.onSignIn();
      });
    }

    // Google sign in button
    const googleSignInBtn = this.findElement('.google-signin-btn');
    if (googleSignInBtn) {
      this.addEventListener(googleSignInBtn, 'click', (e) => {
        e.preventDefault();
        this.onGoogleSignIn();
      });
    }

    // Sign up link
    const signUpLink = this.findElement('.signup-link');
    if (signUpLink) {
      this.addEventListener(signUpLink, 'click', (e) => {
        e.preventDefault();
        this.onSignUpLink();
      });
    }

    // Enter key on form fields
    const usernameField = this.findElement('#username');
    const passwordField = this.findElement('#password');

    if (usernameField) {
      this.addEventListener(usernameField, 'keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.onSignIn();
        }
      });
    }

    if (passwordField) {
      this.addEventListener(passwordField, 'keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.onSignIn();
        }
      });
    }
  }

  onSignIn() {
    if (this.isLoading) return;

    const username = this.findElement('#username')?.value || '';
    const password = this.findElement('#password')?.value || '';

    // Validate inputs
    if (!username || !password) {
      this.showError('Please enter both username/email and password.');
      return;
    }

    // Notify presenter
    this.notifyPresenter('signIn', { username, password });
  }

  onGoogleSignIn() {
    if (this.isLoading) return;
    this.notifyPresenter('googleSignIn');
  }

  onSignUpLink() {
    this.notifyPresenter('showRegister');
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
    const signInBtn = this.findElement('.sign-in-btn');
    const googleSignInBtn = this.findElement('.google-signin-btn');

    if (signInBtn) {
      if (isLoading) {
        signInBtn.textContent = 'Signing in...';
        signInBtn.disabled = true;
      } else {
        signInBtn.textContent = 'Sign In';
        signInBtn.disabled = false;
      }
    }

    if (googleSignInBtn) {
      googleSignInBtn.disabled = isLoading;
    }
  }

  // Show error message
  showError(message) {
    this.removeStatusMessage();

    const messageElement = document.createElement('div');
    messageElement.className = 'login-message error';
    messageElement.textContent = message;

    const formContent = this.findElement('.login-form-content');
    const divider = this.findElement('.login-divider');
    
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
    messageElement.className = 'login-message success';
    messageElement.textContent = message;

    const formContent = this.findElement('.login-form-content');
    const divider = this.findElement('.login-divider');
    
    if (formContent && divider) {
      formContent.insertBefore(messageElement, divider);
    }
  }

  // Remove status message
  removeStatusMessage() {
    const existingMessage = this.findElement('.login-message');
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  // Clear form fields
  clearForm() {
    const usernameField = this.findElement('#username');
    const passwordField = this.findElement('#password');
    
    if (usernameField) usernameField.value = '';
    if (passwordField) passwordField.value = '';
  }

  // Get form data
  getFormData() {
    return {
      username: this.findElement('#username')?.value || '',
      password: this.findElement('#password')?.value || ''
    };
  }

  // Show the login view
  show() {
    if (this.container) {
      // Hide all other sections
      document.querySelectorAll('section.section').forEach(section => {
        if (section.id !== 'login') {
          section.style.display = 'none';
        }
      });

      // Show login section
      this.container.style.display = 'flex';
      this.isVisible = true;

      // Add body class for full-page login
      document.body.classList.add('login-page-active');

      // Scroll to top
      window.scrollTo(0, 0);

      this.onShow();
    }
  }

  // Hide the login view
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;

      // Remove body class
      document.body.classList.remove('login-page-active');

      this.onHide();
    }
  }

  onShow() {
    // Focus on username field when shown
    const usernameField = this.findElement('#username');
    if (usernameField) {
      setTimeout(() => usernameField.focus(), 100);
    }
  }

  onHide() {
    // Clear any status messages when hidden
    this.removeStatusMessage();
  }
}
