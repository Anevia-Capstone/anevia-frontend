// Navigation component

export default class Navigation {
  constructor() {
    this.header = document.getElementById("header");
    this.isScrolled = false;
    this.scrollThreshold = 100; // Pixels to scroll before triggering animation
    this.scrollTimeout = null;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.setupScrollAnimation();
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
            <!-- PWA Install Button -->
            <button class="nav-install-btn desktop-only" id="navInstallBtn" style="display: none;" title="Install Anevia App">
              <i class="fas fa-download"></i>
              <span>Install</span>
            </button>
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
    const installBtn = this.header.querySelector("#navInstallBtn");

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

    // PWA Install button click event
    if (installBtn) {
      installBtn.addEventListener("click", () => {
        // Trigger PWA install prompt
        if (window.pwaManager) {
          window.pwaManager.promptInstall();
        }
      });
    }

    // Listen for PWA install prompt availability
    this.setupPWAInstallButton();
  }

  setupPWAInstallButton() {
    const installBtn = this.header.querySelector("#navInstallBtn");
    if (!installBtn) return;

    // Show install button when PWA can be installed
    window.addEventListener('beforeinstallprompt', () => {
      installBtn.style.display = 'flex';
    });

    // Hide install button after app is installed
    window.addEventListener('appinstalled', () => {
      installBtn.style.display = 'none';
    });

    // Check if app is already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      installBtn.style.display = 'none';
    }
  }

  setupScrollAnimation() {
    // Check if animations should be enabled (disable on mobile for performance)
    this.enableAnimations = window.innerWidth > 768;

    // Throttled scroll handler for better performance
    const handleScroll = () => {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const shouldShrink = scrollY > this.scrollThreshold;

        if (shouldShrink !== this.isScrolled) {
          this.isScrolled = shouldShrink;
          this.animateNavbar(shouldShrink);
        }
      }, 10); // Small delay for throttling
    };

    // Store the handler reference for cleanup
    this.scrollHandler = handleScroll;

    // Add scroll event listener
    window.addEventListener("scroll", this.scrollHandler, { passive: true });

    // Listen for window resize to update animation settings
    window.addEventListener("resize", () => {
      this.enableAnimations = window.innerWidth > 768;
    });

    // Initial check in case page is already scrolled
    handleScroll();
  }

  animateNavbar(shrink) {
    const navbar = this.header.querySelector(".navbar");
    const logo = this.header.querySelector(".logo");
    const navLinks = this.header.querySelectorAll(".nav-links li a");
    const loginBtn = this.header.querySelector(".login-btn");

    if (!navbar) return;

    // Always add/remove the CSS class for styling
    if (shrink) {
      navbar.classList.add("navbar-shrunk");
    } else {
      navbar.classList.remove("navbar-shrunk");
    }

    // Only run anime.js animations on desktop for better performance
    if (!this.enableAnimations) return;

    if (shrink) {
      // Animate navbar to shrink to center with reduced width
      anime({
        targets: navbar,
        width: window.innerWidth <= 768 ? "400px" : "900px",
        duration: 100,
        easing: "easeOutQuad",
      });

      anime({
        targets: logo,
        duration: 100,
        easing: "easeOutQuad",
      });

      // Only animate nav links on desktop (they're hidden on mobile)
      if (window.innerWidth > 768) {
        anime({
          targets: navLinks,
          duration: 100,
          easing: "easeOutQuad",
        });
      }

      if (loginBtn && window.innerWidth > 768) {
        anime({
          targets: loginBtn,
          duration: 100,
          easing: "easeOutQuad",
        });
      }
    } else {
      // Animate back to original full width
      anime({
        targets: navbar,
        width: "100%",
        padding: window.innerWidth <= 768 ? "12px 16px" : "16px 24px",
        duration: 100,
        easing: "easeOutQuad",
      });

      anime({
        targets: logo,
        fontSize: "18px",
        duration: 100,
        easing: "easeOutQuad",
      });

      // Only animate nav links on desktop
      if (window.innerWidth > 768) {
        anime({
          targets: navLinks,
          fontSize: "16px",
          duration: 100,
          easing: "easeOutQuad",
        });
      }

      if (loginBtn && window.innerWidth > 768) {
        anime({
          targets: loginBtn,
          padding: "8px 24px",
          fontSize: "16px",
          duration: 100,
          easing: "easeOutQuad",
        });
      }
    }
  }

  // Cleanup method to remove event listeners
  destroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Remove scroll event listener
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
    }
  }
}
