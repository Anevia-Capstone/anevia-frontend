// User Model for managing user data and authentication
import BaseModel from "./BaseModel.js";
import {
  signInWithEmailPassword,
  signInWithGoogle,
  logoutUser,
  createUserWithEmailPassword,
} from "../firebase/auth.js";

export default class UserModel extends BaseModel {
  constructor() {
    super();
    this.currentUser = null;
    this.backendUser = null;
    this.isAuthenticated = false;
  }

  // Login with email and password
  async login(email, password) {
    try {
      const result = await signInWithEmailPassword(email, password);

      if (result.success) {
        this.currentUser = result.user;
        this.backendUser = result.backendUser;
        this.isAuthenticated = true;

        this.setData("currentUser", this.currentUser);
        this.setData("backendUser", this.backendUser);
        this.setData("isAuthenticated", true);

        return {
          success: true,
          user: result.user,
          backendUser: result.backendUser,
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Login error in UserModel:", error);
      return { success: false, error: error.message };
    }
  }

  // Login with Google
  async loginWithGoogle() {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        this.currentUser = result.user;
        this.backendUser = result.backendUser;
        this.isAuthenticated = true;

        this.setData("currentUser", this.currentUser);
        this.setData("backendUser", this.backendUser);
        this.setData("isAuthenticated", true);

        return {
          success: true,
          user: result.user,
          backendUser: result.backendUser,
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Google login error in UserModel:", error);
      return { success: false, error: error.message };
    }
  }

  // Register new user
  async register(email, password, additionalData = {}) {
    try {
      const result = await createUserWithEmailPassword(
        email,
        password,
        additionalData
      );

      if (result.success) {
        this.currentUser = result.user;
        this.backendUser = result.backendUser;
        this.isAuthenticated = true;

        this.setData("currentUser", this.currentUser);
        this.setData("backendUser", this.backendUser);
        this.setData("isAuthenticated", true);

        return {
          success: true,
          user: result.user,
          backendUser: result.backendUser,
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Registration error in UserModel:", error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      const result = await logoutUser();

      if (result.success) {
        this.currentUser = null;
        this.backendUser = null;
        this.isAuthenticated = false;

        this.setData("currentUser", null);
        this.setData("backendUser", null);
        this.setData("isAuthenticated", false);

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Logout error in UserModel:", error);
      return { success: false, error: error.message };
    }
  }

  // Update user data
  updateUserData(user, backendUser) {
    this.currentUser = user;
    this.backendUser = backendUser;
    this.isAuthenticated = !!user;

    this.setData("currentUser", this.currentUser);
    this.setData("backendUser", this.backendUser);
    this.setData("isAuthenticated", this.isAuthenticated);
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
    return this.isAuthenticated;
  }

  // Clear user data
  clearUserData() {
    this.currentUser = null;
    this.backendUser = null;
    this.isAuthenticated = false;
    this.clearData();
  }
}
