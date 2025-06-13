// About View for displaying the about page
import BaseView from "./BaseView.js";
import { animationManager } from "../utils/animations.js";
import { toggleWithTransition } from "../utils/viewTransitions.js";

export default class AboutView extends BaseView {
  constructor() {
    super("about");
    // Set global instance for onclick handler
    window.aboutViewInstance = this;
    this.init();
  }

  init() {
    this.render();
    // Setup event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.setupEventListeners();
    }, 100);
  }

  render() {
    const html = `
      <div class="about-page-container">
        <!-- About Hero Section -->
        <div class="about-hero-section" data-animation="fadeInUp">
          <div class="container">
            <h1 class="about-hero-title">About Us</h1>
          </div>
        </div>

        <!-- Content Section -->
        <div class="about-content-section">
          <div class="container">
            <div class="about-container">
              <!-- Vision Section -->
              <div class="content-block vision-block" data-animation="fadeInUp">
                <h2 class="content-title">Vision</h2>
                <p class="content-text" id="vision-text">
                  <!-- Vision text will be inserted here -->
                </p>
              </div>

              <!-- Mission Section -->
              <div class="content-block mission-block" data-animation="fadeInUp">
                <h2 class="content-title">Mission</h2>
                <p class="content-text" id="mission-text">
                  <!-- Mission text will be inserted here -->
                </p>
              </div>

              <!-- Project Information Section -->
              <div class="content-block project-block" data-animation="fadeInUp">
                <h2 class="content-title">Project Information</h2>
                <p class="content-text" id="project-text">
                  <!-- Project text will be inserted here -->
                </p>
                <button class="github-btn" id="github-repository-btn">
                  GitHub Repository
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Section -->
        <div class="team-section" data-animation="fadeInUp">
          <div class="container">
            <div class="team-header">
              <h2 class="team-title">Meet Our Dedicated Team</h2>
              <button class="view-all-btn" id="view-all-btn" onclick="window.aboutViewInstance?.toggleTeamContainer()">View All</button>
            </div>
            <div class="team-container" id="team-container">
              <!-- Team members will be inserted here -->
              <div class="team-member">
                <div class="member-avatar">
                  <img src="/src/assets/team-placeholder.svg" alt="Test Member" class="member-image">
                </div>
                <div class="member-info">
                  <h3 class="member-name">Test Member</h3>
                  <p class="member-role">Test Role</p>
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
    // Add any specific event listeners for the about page

    // Use event delegation on the container to handle clicks
    if (this.container) {
      this.container.addEventListener("click", (event) => {
        // GitHub repository button
        if (event.target.id === "github-repository-btn") {
          window.open("https://github.com/Anevia-Capstone", "_blank");
        }

        // View All button
        if (event.target.id === "view-all-btn") {
          this.toggleTeamContainer();
        }
      });
    }

    // Also try direct approach as backup
    setTimeout(() => {
      const viewAllBtn = document.getElementById("view-all-btn");
      if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => {
          this.toggleTeamContainer();
        });
      }
    }, 200);
  }

  // Toggle team container visibility with View Transition
  async toggleTeamContainer() {
    const teamContainer = document.getElementById("team-container");
    const viewAllBtn = document.getElementById("view-all-btn");

    if (!teamContainer || !viewAllBtn) {
      console.error("❌ Required elements not found!");
      return;
    }

    // Check current visibility
    const isVisible = teamContainer.classList.contains("show");

    // Use View Transition utility
    await toggleWithTransition(
      teamContainer,
      () => this.performToggle(teamContainer, viewAllBtn, isVisible),
      {
        transitionName: "team-container-toggle",
        duration: 400,
      }
    );
  }

  // Perform the actual toggle operation
  performToggle(teamContainer, viewAllBtn, isVisible) {
    if (isVisible) {
      // Hide the container
      teamContainer.classList.remove("show");
      viewAllBtn.textContent = "View All";
    } else {
      // Show the container
      // Load team members if container is empty
      if (teamContainer.children.length <= 1) {
        // Only test member exists
        this.loadTeamMembers();
      }

      // Add stagger animation indices to team members
      this.addStaggerIndices(teamContainer);

      teamContainer.classList.add("show");
      viewAllBtn.textContent = "Hide";
    }

    // Verify the change
    setTimeout(() => {
      const hasShow = teamContainer.classList.contains("show");
    }, 100);
  }

  // Add CSS custom properties for stagger animation
  addStaggerIndices(container) {
    const members = container.querySelectorAll(".team-member");
    members.forEach((member, index) => {
      member.style.setProperty("--index", index);
    });
  }

  // Load team members data
  loadTeamMembers() {
    try {
      if (this.presenter && this.presenter.model) {
        const aboutData = this.presenter.model.getAllData();
        if (aboutData && aboutData.teamMembers) {
          this.renderTeamMembers(aboutData.teamMembers);
        }
      }
    } catch (error) {
      console.error("❌ Error loading team members:", error);
    }
  }

  // Update the view with data from the model
  updateContent(data) {
    if (!data) return;

    const { teamMembers, companyInfo } = data;

    // Update mission, vision, and project info
    if (companyInfo) {
      const missionElement = document.getElementById("mission-text");
      const visionElement = document.getElementById("vision-text");
      const projectElement = document.getElementById("project-text");

      if (missionElement) missionElement.textContent = companyInfo.mission;
      if (visionElement) visionElement.textContent = companyInfo.vision;
      if (projectElement) projectElement.textContent = companyInfo.projectInfo;
    }

    // Update team members
    if (teamMembers) {
      this.renderTeamMembers(teamMembers);
    }
  }

  renderTeamMembers(teamMembers) {
    const container = document.getElementById("team-container");
    if (!container || !teamMembers) return;

    const teamHTML = teamMembers
      .map(
        (member) => `
      <div class="team-member" data-animation="fadeInUp">
        <div class="member-avatar">
          <img src="${member.image}" alt="${member.name}" class="member-image">
        </div>
        <div class="member-info">
          <h3 class="member-name">${member.name}</h3>
          <p class="member-role">${member.role}</p>
        </div>
      </div>
    `
      )
      .join("");

    container.innerHTML = teamHTML;
  }

  onShow() {
    // Scroll to top when showing about page
    window.scrollTo(0, 0);

    // Setup event listeners again to ensure they're working
    setTimeout(() => {
      this.setupEventListeners();
    }, 100);

    // Initialize animations
    this.initializeAnimations();
  }

  initializeAnimations() {
    // Setup scroll-triggered animations
    setTimeout(() => {
      animationManager.observeElements("[data-animation]");
    }, 100);
  }

  update(data) {
    // Update view if needed based on data changes
    this.updateContent(data);
  }
}
