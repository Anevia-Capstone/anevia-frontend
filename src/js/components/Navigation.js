// Navigation component

export default class Navigation {
  constructor() {
    this.header = document.getElementById("header");
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.header.innerHTML = `
      <div class="container nav-container">
        <div class="navbar">
          <a href="#home" class="logo">
            Anevia
          </a>
          <button class="mobile-menu-btn">
            <i class="fas fa-bars"></i>
          </button>
          <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#tools">Tools</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li class="mobile-login"><button class="login-btn">Login</button></li>
          </ul>
          <div class="nav-right">
            <button class="login-btn desktop-only">Login</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const mobileMenuBtn = this.header.querySelector(".mobile-menu-btn");
    const navLinks = this.header.querySelector(".nav-links");
    const links = this.header.querySelectorAll(".nav-links a");
    const loginBtns = this.header.querySelectorAll(".login-btn");

    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close mobile menu when a link is clicked
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });

    // Login button click event
    loginBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Custom event that will be handled in main.js
        const loginEvent = new CustomEvent("showLogin");
        document.dispatchEvent(loginEvent);

        // Close mobile menu if open
        navLinks.classList.remove("active");
      });
    });
  }
}
