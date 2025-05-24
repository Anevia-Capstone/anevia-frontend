// Login Presenter for managing login logic
import BasePresenter from './BasePresenter.js';
import LoginView from '../views/LoginView.js';
import UserModel from '../models/UserModel.js';

export default class LoginPresenter extends BasePresenter {
  constructor() {
    const model = new UserModel();
    const view = new LoginView();
    super(model, view);
    
    // Set presenter reference in view
    this.view.setPresenter(this);
  }

  onShow() {
    console.log('LoginPresenter shown');
  }

  onHide() {
    console.log('LoginPresenter hidden');
    // Clear form when hiding
    this.view.clearForm();
  }

  // Handle user actions from the view
  handleUserAction(action, data = {}) {
    switch (action) {
      case 'signIn':
        this.handleSignIn(data.username, data.password);
        break;
      case 'googleSignIn':
        this.handleGoogleSignIn();
        break;
      case 'showRegister':
        this.navigate('register');
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  async handleSignIn(username, password) {
    try {
      this.view.setLoading(true);
      this.view.removeStatusMessage();

      // Determine if input is email or username
      const isEmail = username.includes('@');
      const email = isEmail ? username : `${username}@example.com`; // Convert username to email format

      const result = await this.model.login(email, password);

      if (result.success) {
        console.log('Login successful:', result.user);
        console.log('Backend user data:', result.backendUser);

        this.view.showSuccess('Login successful!');
        
        // Redirect to home page after successful login
        setTimeout(() => {
          this.navigate('home');
          // Reload to update UI with logged in state
          window.location.reload();
        }, 1000);
      } else {
        this.view.showError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.view.showError('An error occurred during login. Please try again.');
    } finally {
      this.view.setLoading(false);
    }
  }

  async handleGoogleSignIn() {
    try {
      this.view.setLoading(true);
      this.view.removeStatusMessage();

      const result = await this.model.loginWithGoogle();

      if (result.success) {
        console.log('Google login successful:', result.user);
        console.log('Backend user data:', result.backendUser);

        this.view.showSuccess('Google login successful!');
        
        // Redirect to home page after successful login
        setTimeout(() => {
          this.navigate('home');
          // Reload to update UI with logged in state
          window.location.reload();
        }, 1000);
      } else {
        this.view.showError(result.error || 'Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      this.view.showError('An error occurred during Google login. Please try again.');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Update method called when model data changes
  onUpdate(data) {
    if (data.key === 'isAuthenticated' && data.value === true) {
      // User is now authenticated, redirect to home
      this.navigate('home');
    }
  }

  // Check if user is already authenticated
  checkAuthState() {
    if (this.model.isUserAuthenticated()) {
      // User is already logged in, redirect to home
      this.navigate('home');
      return true;
    }
    return false;
  }
}
