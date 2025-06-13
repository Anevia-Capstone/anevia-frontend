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
      <div class="nav-container">
        <div class="navbar">
          <a href="#home" class="logo">
            Anevia
          </a>
          <button class="mobile-menu-btn">
            <i class="fas fa-bars"></i>
          </button>
          <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#scan-history">Chat</a></li>
            <li><a href="#tools">Tools</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li class="mobile-login"><button class="login-btn">Login</button></li>
          </ul>
          <div class="nav-right">
            <!-- PWA Install Button - Removed/Hidden -->
            <!--
            <button class="nav-install-btn desktop-only" id="navInstallBtn" style="display: none;" title="Install Anevia App">
              <i class="fas fa-download"></i>
              <span>Install</span>
            </button>
            -->
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

    // PWA Install button click event - Disabled (button removed)
    /*
    if (installBtn) {
      installBtn.addEventListener("click", () => {
        // Trigger PWA install prompt
        if (window.pwaManager) {
          window.pwaManager.promptInstall();
        }
      });
    }
    */

    // Listen for PWA install prompt availability - Disabled
    // this.setupPWAInstallButton();
  }

  setupPWAInstallButton() {
    const installBtn = this.header.querySelector("#navInstallBtn");
    if (!installBtn) return;

    // Keep install button hidden - disabled functionality
    installBtn.style.display = "none";

    // Commented out - install button functionality disabled
    /*
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
    */
  }

  setupScrollAnimation() {
    // Check if animations should be enabled (disable on mobile for performance)
    // Disable animations completely for screens 425px and below
    this.enableAnimations = window.innerWidth > 768;
    this.enableScrollEffects = window.innerWidth > 425;

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
          // Only animate if scroll effects are enabled (not on very small screens)
          if (this.enableScrollEffects) {
            this.animateNavbar(shouldShrink);
          }
        }
      }, 10); // Small delay for throttling
    };

    // Store the handler reference for cleanup
    this.scrollHandler = handleScroll;

    // Add scroll event listener only if scroll effects are enabled
    if (this.enableScrollEffects) {
      window.addEventListener("scroll", this.scrollHandler, { passive: true });
    }

    // Listen for window resize to update animation settings
    window.addEventListener("resize", () => {
      const oldEnableScrollEffects = this.enableScrollEffects;
      this.enableAnimations = window.innerWidth > 768;
      this.enableScrollEffects = window.innerWidth > 425;

      // Close mobile menu on resize to prevent layout issues
      const navLinks = this.header.querySelector(".nav-links");
      if (navLinks) {
        navLinks.classList.remove("active");
      }

      // Add or remove scroll listener based on screen size
      if (this.enableScrollEffects && !oldEnableScrollEffects) {
        window.addEventListener("scroll", this.scrollHandler, {
          passive: true,
        });
      } else if (!this.enableScrollEffects && oldEnableScrollEffects) {
        window.removeEventListener("scroll", this.scrollHandler);
        // Reset navbar to default state when disabling scroll effects
        const navbar = this.header.querySelector(".navbar");
        if (navbar) {
          navbar.classList.remove("navbar-shrunk");
        }
      }
    });

    // Initial check in case page is already scrolled (only if scroll effects enabled)
    if (this.enableScrollEffects) {
      handleScroll();
    }
  }

  animateNavbar(shrink) {
    const navbar = this.header.querySelector(".navbar");
    const logo = this.header.querySelector(".logo");
    const navLinks = this.header.querySelectorAll(".nav-links li a");
    const loginBtn = this.header.querySelector(".login-btn");

    if (!navbar) return;

    // Get current screen width for responsive behavior
    // Use both window.innerWidth and screen.width for better device detection
    const screenWidth = Math.min(
      window.innerWidth,
      window.screen?.width || window.innerWidth
    );
    const viewportWidth = window.innerWidth;

    // Check if we're in a small screen environment (including device emulation)
    const isSmallScreen =
      screenWidth <= 425 ||
      viewportWidth <= 425 ||
      window.matchMedia("(max-width: 425px)").matches ||
      window.matchMedia("(max-device-width: 425px)").matches;

    // For very small screens (425px and below), completely disable animations
    if (isSmallScreen) {
      // Only apply CSS classes, no animations
      if (shrink) {
        navbar.classList.add("navbar-shrunk");
      } else {
        navbar.classList.remove("navbar-shrunk");
      }
      return; // Exit early, no animations
    }

    // Always add/remove the CSS class for styling
    if (shrink) {
      navbar.classList.add("navbar-shrunk");
    } else {
      navbar.classList.remove("navbar-shrunk");
    }

    // Only run anime.js animations on desktop for better performance
    if (!this.enableAnimations) return;

    if (shrink) {
      // Only animate width on larger screens (above 768px)
      if (screenWidth > 768) {
        // Determine navbar width based on screen size
        let navbarWidth = "900px";
        if (screenWidth <= 1024) {
          navbarWidth = "700px";
        }

        // Animate navbar to shrink to center with reduced width
        anime({
          targets: navbar,
          width: navbarWidth,
          duration: 100,
          easing: "easeOutQuad",
        });
      }

      anime({
        targets: logo,
        duration: 100,
        easing: "easeOutQuad",
      });

      // Only animate nav links on desktop (they're hidden on mobile)
      if (screenWidth > 768) {
        anime({
          targets: navLinks,
          duration: 100,
          easing: "easeOutQuad",
        });
      }

      if (loginBtn && screenWidth > 768) {
        anime({
          targets: loginBtn,
          duration: 100,
          easing: "easeOutQuad",
        });
      }
    } else {
      // Only animate width and padding on larger screens
      if (screenWidth > 768) {
        // Animate back to original full width
        anime({
          targets: navbar,
          width: "100%",
          duration: 100,
          easing: "easeOutQuad",
        });
      }

      // Determine logo font size based on screen size
      let logoFontSize = "18px";
      if (screenWidth <= 480) {
        logoFontSize = "16px";
      } else if (screenWidth <= 768) {
        logoFontSize = "16px";
      } else if (screenWidth <= 1024) {
        logoFontSize = "17px";
      }

      anime({
        targets: logo,
        fontSize: logoFontSize,
        duration: 100,
        easing: "easeOutQuad",
      });

      // Only animate nav links on desktop
      if (screenWidth > 768) {
        let linkFontSize = "16px";
        if (screenWidth <= 1024) {
          linkFontSize = "15px";
        }

        anime({
          targets: navLinks,
          fontSize: linkFontSize,
          duration: 100,
          easing: "easeOutQuad",
        });
      }

      if (loginBtn && screenWidth > 768) {
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

    // Reset navbar state
    const navbar = this.header.querySelector(".navbar");
    if (navbar) {
      navbar.classList.remove("navbar-shrunk");
    }
  }
}
