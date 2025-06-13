// Register Presenter for managing registration logic
import BasePresenter from "./BasePresenter.js";
import RegisterView from "../views/RegisterView.js";
import UserModel from "../models/UserModel.js";

export default class RegisterPresenter extends BasePresenter {
  constructor() {
    const model = new UserModel();
    const view = new RegisterView();
    super(model, view);

    // Set presenter reference in view
    this.view.setPresenter(this);
  }

  onShow() {}

  onHide() {
    // Clear form when hiding
    this.view.clearForm();
  }

  // Handle user actions from the view
  handleUserAction(action, data = {}) {
    switch (action) {
      case "signUp":
        this.handleSignUp(data.username, data.email, data.password);
        break;
      case "googleSignUp":
        this.handleGoogleSignUp();
        break;
      case "showLogin":
        this.navigate("login");
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  async handleSignUp(username, email, password) {
    try {
      this.view.setLoading(true);
      this.view.removeStatusMessage();

      const result = await this.model.register(email, password, { username });

      if (result.success) {
        this.view.showSuccess("Registration successful! You can now sign in.");

        // Redirect to login page after successful registration
        setTimeout(() => {
          this.navigate("login");
        }, 2000);
      } else {
        // Handle specific error codes
        this.handleRegistrationError(result.error, result.code);
      }
    } catch (error) {
      this.view.showError(
        "An error occurred during registration. Please try again."
      );
    } finally {
      this.view.setLoading(false);
    }
  }

  async handleGoogleSignUp() {
    try {
      this.view.setLoading(true);
      this.view.removeStatusMessage();

      const result = await this.model.loginWithGoogle(); // Google signup uses same method as login

      if (result.success) {
        this.view.showSuccess("Google sign-up successful!");

        // Redirect to home page after successful signup
        setTimeout(() => {
          this.navigate("home");
          // Reload to update UI with logged in state
          window.location.reload();
        }, 1000);
      } else {
        this.view.showError(
          result.error || "Google sign-up failed. Please try again."
        );
      }
    } catch (error) {
      this.view.showError(
        "An error occurred during Google sign-up. Please try again."
      );
    } finally {
      this.view.setLoading(false);
    }
  }

  // Handle specific registration errors
  handleRegistrationError(error, code) {
    console.error("Registration failed with error:", error);
    console.error("Error code:", code);

    switch (code) {
      case "auth/email-already-in-use":
        this.view.showError(
          "This email is already registered. Please use a different email or sign in."
        );
        break;
      case "auth/invalid-email":
        this.view.showError("Please enter a valid email address.");
        break;
      case "auth/weak-password":
        this.view.showError(
          "Password is too weak. Please use a stronger password."
        );
        break;
      case "auth/operation-not-allowed":
        this.view.showError(
          "Email/password accounts are not enabled. Please contact support."
        );
        break;
      default:
        this.view.showError(error || "Registration failed. Please try again.");
    }
  }

  // Update method called when model data changes
  onUpdate(data) {
    if (data.key === "isAuthenticated" && data.value === true) {
      // User is now authenticated, redirect to home
      this.navigate("home");
    }
  }

  // Check if user is already authenticated
  checkAuthState() {
    if (this.model.isUserAuthenticated()) {
      // User is already logged in, redirect to home
      this.navigate("home");
      return true;
    }
    return false;
  }
}
