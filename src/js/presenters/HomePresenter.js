// Home Presenter for managing home page logic
import BasePresenter from "./BasePresenter.js";
import HomeView from "../views/HomeView.js";

export default class HomePresenter extends BasePresenter {
  constructor() {
    const view = new HomeView();
    super(null, view); // Home doesn't need a specific model
  }

  onShow() {
    console.log("HomePresenter shown");
    // Any additional logic when home page is shown
  }

  onHide() {
    console.log("HomePresenter hidden");
    // Any cleanup when home page is hidden
  }

  // Handle user actions specific to home page
  handleUserAction(action, data) {
    switch (action) {
      case "tryItNow":
        this.navigate("tools");
        break;
      case "learnMore":
        this.scrollToAbout();
        break;
      default:
        super.handleUserAction(action, data);
    }
  }

  scrollToAbout() {
    // Scroll to about section within the home page
    const aboutSection = document.querySelector(".how-it-works");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollToSection(section) {
    let targetElement = null;

    switch (section) {
      case "about":
        targetElement = document.querySelector(".how-it-works");
        break;
      case "faq":
        targetElement = document.querySelector(".faq-section");
        break;
      default:
        console.warn(`Unknown section: ${section}`);
        return;
    }

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Section element not found: ${section}`);
    }
  }
}
