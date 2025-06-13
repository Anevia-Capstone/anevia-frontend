// About Presenter for managing about page logic
import BasePresenter from "./BasePresenter.js";
import AboutView from "../views/AboutView.js";
import AboutModel from "../models/AboutModel.js";

export default class AboutPresenter extends BasePresenter {
  constructor() {
    const model = new AboutModel();
    const view = new AboutView();
    super(model, view);

    // Set presenter reference in view
    this.view.setPresenter(this);
  }

  onShow() {
    // Load and display about page data
    this.loadAboutData();

    // Scroll to top when showing about page
    window.scrollTo(0, 0);
  }

  onHide() {
    // Any cleanup when about page is hidden
  }

  // Load about page data
  loadAboutData() {
    try {
      const aboutData = this.model.getAllData();
      this.view.updateContent(aboutData);
    } catch (error) {
      console.error("Error loading about data:", error);
    }
  }

  // Handle user actions specific to about page
  handleUserAction(action, data) {
    switch (action) {
      case "contactUs":
        this.handleContactAction(data);
        break;
      case "viewTeamMember":
        this.handleTeamMemberAction(data);
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  // Handle contact actions
  handleContactAction(data) {
    // Implement contact functionality if needed
  }

  // Handle team member actions
  handleTeamMemberAction(data) {
    // Implement team member profile functionality if needed
  }

  // Get team members data
  getTeamMembers() {
    return this.model.getTeamMembers();
  }

  // Get company information
  getCompanyInfo() {
    return this.model.getCompanyInfo();
  }
}
