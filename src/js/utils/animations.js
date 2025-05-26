// Animation utilities using Anime.js
export class AnimationManager {
  constructor() {
    this.isAnimating = false;
    this.scrollObserver = null;
    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.setupGlobalAnimations();
  }

  // Setup Intersection Observer for scroll-triggered animations
  setupScrollObserver() {
    if (!window.IntersectionObserver) return;

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const animationType = target.dataset.animation;

            if (animationType && !target.classList.contains("animated")) {
              this.triggerAnimation(target, animationType);
              target.classList.add("animated");
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );
  }

  // Observe elements for scroll animations
  observeElements(selector) {
    if (!this.scrollObserver) return;

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      this.scrollObserver.observe(el);
    });
  }

  // Trigger specific animation based on type
  triggerAnimation(target, type) {
    switch (type) {
      case "fadeInUp":
        this.fadeInUp(target);
        break;
      case "fadeInLeft":
        this.fadeInLeft(target);
        break;
      case "fadeInRight":
        this.fadeInRight(target);
        break;
      case "scaleIn":
        this.scaleIn(target);
        break;
      case "slideInUp":
        this.slideInUp(target);
        break;
      case "staggerFadeIn":
        this.staggerFadeIn(target);
        break;
      case "bounceIn":
        this.bounceIn(target);
        break;
      case "rotateIn":
        this.rotateIn(target);
        break;
      case "typeWriter":
        this.typeWriter(target);
        break;
      default:
        this.fadeInUp(target);
    }
  }

  // Hero section animations
  animateHeroSection() {
    const heroTitle = document.querySelector(".hero-title");
    const heroButton = document.querySelector(".hero-try-now-btn");

    if (heroTitle) {
      // Set initial state
      anime.set(heroTitle, {
        opacity: 0,
        translateY: 50,
      });

      // Animate title
      anime({
        targets: heroTitle,
        opacity: 1,
        translateY: 0,
        duration: 1200,
        easing: "easeOutExpo",
        delay: 300,
      });
    }

    if (heroButton) {
      // Set initial state
      anime.set(heroButton, {
        opacity: 0,
        scale: 0.8,
      });

      // Animate button
      anime({
        targets: heroButton,
        opacity: 1,
        scale: 1,
        duration: 800,
        easing: "easeOutBack",
        delay: 800,
      });
    }
  }

  // Feature cards stagger animation
  animateFeatureCards() {
    const cards = document.querySelectorAll(".feature-card");

    if (cards.length === 0) return;

    // Set initial state
    anime.set(cards, {
      opacity: 0,
      translateY: 50,
      scale: 0.9,
    });

    // Stagger animation
    anime({
      targets: cards,
      opacity: 1,
      translateY: 0,
      scale: 1,
      duration: 800,
      easing: "easeOutExpo",
      delay: anime.stagger(200),
    });
  }

  // Steps animation with counter
  animateSteps() {
    const steps = document.querySelectorAll(".step");
    const stepNumbers = document.querySelectorAll(".step-number");

    if (steps.length === 0) return;

    // Set initial state
    anime.set(steps, {
      opacity: 0,
      translateX: -50,
    });

    // Animate steps
    anime({
      targets: steps,
      opacity: 1,
      translateX: 0,
      duration: 600,
      easing: "easeOutExpo",
      delay: anime.stagger(300),
    });

    // Animate step numbers with scale effect
    stepNumbers.forEach((number, index) => {
      anime({
        targets: number,
        scale: [0, 1.2, 1],
        duration: 600,
        easing: "easeOutBack",
        delay: 300 + index * 300,
      });
    });
  }

  // Team members stagger animation - improved version
  animateTeamMembers() {
    const members = document.querySelectorAll(".team-member");

    if (members.length === 0) return;

    // Set initial state with better transforms
    anime.set(members, {
      opacity: 0,
      translateY: 50,
      scale: 0.8,
    });

    // Stagger animation with smoother easing
    anime({
      targets: members,
      opacity: 1,
      translateY: 0,
      scale: 1,
      duration: 1000,
      easing: "easeOutCubic",
      delay: anime.stagger(200, { start: 300 }),
    });

    // Add individual hover animations for team members
    members.forEach((member) => {
      const memberImage = member.querySelector(".member-image");

      member.addEventListener("mouseenter", () => {
        anime({
          targets: memberImage,
          scale: 1.1,
          duration: 300,
          easing: "easeOutQuad",
        });

        anime({
          targets: member,
          translateY: -10,
          duration: 300,
          easing: "easeOutQuad",
        });
      });

      member.addEventListener("mouseleave", () => {
        anime({
          targets: memberImage,
          scale: 1,
          duration: 300,
          easing: "easeOutQuad",
        });

        anime({
          targets: member,
          translateY: 0,
          duration: 300,
          easing: "easeOutQuad",
        });
      });
    });
  }

  // Basic animation functions
  fadeInUp(target) {
    anime.set(target, {
      opacity: 0,
      translateY: 30,
    });

    anime({
      targets: target,
      opacity: 1,
      translateY: 0,
      duration: 800,
      easing: "easeOutExpo",
    });
  }

  fadeInLeft(target) {
    anime.set(target, {
      opacity: 0,
      translateX: -30,
    });

    anime({
      targets: target,
      opacity: 1,
      translateX: 0,
      duration: 800,
      easing: "easeOutExpo",
    });
  }

  fadeInRight(target) {
    anime.set(target, {
      opacity: 0,
      translateX: 30,
    });

    anime({
      targets: target,
      opacity: 1,
      translateX: 0,
      duration: 800,
      easing: "easeOutExpo",
    });
  }

  scaleIn(target) {
    anime.set(target, {
      opacity: 0,
      scale: 0.8,
    });

    anime({
      targets: target,
      opacity: 1,
      scale: 1,
      duration: 600,
      easing: "easeOutBack",
    });
  }

  slideInUp(target) {
    anime.set(target, {
      opacity: 0,
      translateY: 50,
    });

    anime({
      targets: target,
      opacity: 1,
      translateY: 0,
      duration: 800,
      easing: "easeOutExpo",
    });
  }

  staggerFadeIn(target) {
    const children = target.children;

    anime.set(children, {
      opacity: 0,
      translateY: 20,
    });

    anime({
      targets: children,
      opacity: 1,
      translateY: 0,
      duration: 600,
      easing: "easeOutExpo",
      delay: anime.stagger(100),
    });
  }

  bounceIn(target) {
    anime.set(target, {
      opacity: 0,
      scale: 0.3,
    });

    anime({
      targets: target,
      opacity: 1,
      scale: 1,
      duration: 800,
      easing: "easeOutBounce",
    });
  }

  rotateIn(target) {
    anime.set(target, {
      opacity: 0,
      rotate: -180,
      scale: 0.8,
    });

    anime({
      targets: target,
      opacity: 1,
      rotate: 0,
      scale: 1,
      duration: 800,
      easing: "easeOutExpo",
    });
  }

  // Typing animation for text elements
  typeWriter(target) {
    const originalText = target.textContent.trim();

    // Clear the target and add typing-animation class
    target.innerHTML = "";
    target.classList.add("typing-animation");

    // Create cursor element
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";

    // Start typing animation
    this.startTypingAnimation(target, originalText, cursor);
  }

  // Start the typing animation
  startTypingAnimation(target, text, cursor) {
    let currentIndex = 0;
    const typingSpeed = 50; // milliseconds per character

    // Add cursor to target
    target.appendChild(cursor);

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        const char = text.charAt(currentIndex);

        // Insert character before cursor
        const textNode = document.createTextNode(char);
        target.insertBefore(textNode, cursor);

        currentIndex++;

        // Variable speed for more natural typing
        let delay = typingSpeed;
        if (char === " ") delay = 50;
        if (char === "," || char === ";") delay = 100;
        if (char === "." || char === "!" || char === "?") delay = 150;

        setTimeout(typeNextChar, delay);
      } else {
        // Typing complete - hide cursor after a delay
        setTimeout(() => {
          cursor.classList.add("hidden");
        }, 2000);
      }
    };

    // Start typing after a short delay
    setTimeout(typeNextChar, 500);
  }

  // Setup global animations and effects
  setupGlobalAnimations() {
    // Add smooth page transitions
    this.setupPageTransitions();

    // Add button hover effects
    this.setupButtonHoverEffects();
  }

  // Page transition animations
  setupPageTransitions() {
    // This will be called when switching between pages
    window.addEventListener("hashchange", () => {
      this.animatePageTransition();
    });
  }

  animatePageTransition() {
    const sections = document.querySelectorAll(".section");

    sections.forEach((section) => {
      if (section.style.display !== "none") {
        anime({
          targets: section,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          easing: "easeOutExpo",
        });
      }
    });
  }

  // Enhanced button hover effects
  setupButtonHoverEffects() {
    const buttons = document.querySelectorAll(
      ".btn, .hero-try-now-btn, .action-btn"
    );

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        anime({
          targets: button,
          scale: 1.05,
          duration: 200,
          easing: "easeOutQuad",
        });
      });

      button.addEventListener("mouseleave", () => {
        anime({
          targets: button,
          scale: 1,
          duration: 200,
          easing: "easeOutQuad",
        });
      });
    });

    // Add special effects for FAQ categories
    this.setupFAQCategoryAnimations();
  }

  // FAQ category animations
  setupFAQCategoryAnimations() {
    const categories = document.querySelectorAll(".faq-category");

    categories.forEach((category) => {
      category.addEventListener("click", () => {
        // Animate the clicked category
        anime({
          targets: category,
          scale: [1, 1.1, 1],
          duration: 300,
          easing: "easeOutBack",
        });

        // Animate other categories
        const otherCategories = Array.from(categories).filter(
          (cat) => cat !== category
        );
        anime({
          targets: otherCategories,
          scale: [1, 0.95, 1],
          duration: 300,
          easing: "easeOutQuad",
        });
      });
    });
  }

  // Animate accordion items - improved version
  animateAccordionItem(item, isOpening) {
    const content = item.querySelector(".accordion-content");
    const body = item.querySelector(".accordion-body");
    const icon = item.querySelector(".accordion-icon i");
    const header = item.querySelector(".accordion-header");

    if (isOpening) {
      // Get the natural height of the content
      const naturalHeight = body.scrollHeight;

      // Animate the accordion opening
      anime({
        targets: content,
        maxHeight: [`0px`, `${naturalHeight + 32}px`], // Add padding
        duration: 600,
        easing: "easeOutCubic",
        complete: () => {
          // Set to auto after animation for responsive behavior
          content.style.maxHeight = "auto";
        },
      });

      anime({
        targets: body,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 400,
        delay: 200,
        easing: "easeOutQuad",
      });

      anime({
        targets: icon,
        rotate: 180,
        duration: 400,
        easing: "easeOutBack",
      });

      // Add subtle header animation
      anime({
        targets: header,
        backgroundColor: ["#ffffff", "#f8f9fa"],
        duration: 300,
        easing: "easeOutQuad",
      });
    } else {
      // Get current height for smooth closing
      const currentHeight = content.scrollHeight;
      content.style.maxHeight = `${currentHeight}px`;

      anime({
        targets: content,
        maxHeight: [`${currentHeight}px`, "0px"],
        duration: 400,
        easing: "easeInCubic",
      });

      anime({
        targets: body,
        opacity: [1, 0],
        translateY: [0, -10],
        duration: 200,
        easing: "easeInQuad",
      });

      anime({
        targets: icon,
        rotate: 0,
        duration: 400,
        easing: "easeOutBack",
      });

      // Reset header background
      anime({
        targets: header,
        backgroundColor: ["#f8f9fa", "#ffffff"],
        duration: 300,
        easing: "easeOutQuad",
      });
    }
  }

  // About section animations
  animateAboutSection() {
    const missionVision = document.querySelectorAll(".mission, .vision");
    const aboutTitle = document.querySelector(".about-section .section-title");
    const aboutSubtitle = document.querySelector(
      ".about-section .section-subtitle"
    );

    // Animate title and subtitle first
    if (aboutTitle) {
      anime({
        targets: aboutTitle,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: "easeOutExpo",
      });
    }

    if (aboutSubtitle) {
      anime({
        targets: aboutSubtitle,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 200,
        easing: "easeOutExpo",
      });
    }

    // Animate mission and vision with stagger
    if (missionVision.length > 0) {
      anime.set(missionVision, {
        opacity: 0,
        translateX: (_, i) => (i === 0 ? -50 : 50),
        scale: 0.9,
      });

      anime({
        targets: missionVision,
        opacity: 1,
        translateX: 0,
        scale: 1,
        duration: 1000,
        delay: anime.stagger(300, { start: 400 }),
        easing: "easeOutCubic",
      });
    }
  }

  // FAQ section animations
  animateFAQSection() {
    const faqTitle = document.querySelector(".faq-section .section-title");
    const faqSubtitle = document.querySelector(
      ".faq-section .section-subtitle"
    );
    const faqCategories = document.querySelectorAll(".faq-category");
    const accordionItems = document.querySelectorAll(".accordion-item");

    // Animate title and subtitle
    if (faqTitle) {
      anime({
        targets: faqTitle,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: "easeOutExpo",
      });
    }

    if (faqSubtitle) {
      anime({
        targets: faqSubtitle,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 200,
        easing: "easeOutExpo",
      });
    }

    // Animate FAQ categories with bounce effect
    if (faqCategories.length > 0) {
      anime.set(faqCategories, {
        opacity: 0,
        scale: 0.8,
        translateY: 20,
      });

      anime({
        targets: faqCategories,
        opacity: 1,
        scale: 1,
        translateY: 0,
        duration: 600,
        delay: anime.stagger(100, { start: 400 }),
        easing: "easeOutBack",
      });
    }

    // Animate accordion items
    if (accordionItems.length > 0) {
      anime.set(accordionItems, {
        opacity: 0,
        translateX: -30,
      });

      anime({
        targets: accordionItems,
        opacity: 1,
        translateX: 0,
        duration: 800,
        delay: anime.stagger(150, { start: 800 }),
        easing: "easeOutExpo",
      });
    }
  }

  // Enhanced stagger animations
  animateStaggerFadeIn(elements, options = {}) {
    const {
      duration = 800,
      delay = 200,
      staggerDelay = 150,
      direction = "up",
      distance = 30,
    } = options;

    if (!elements || elements.length === 0) return;

    const translateProperty =
      direction === "up"
        ? "translateY"
        : direction === "down"
        ? "translateY"
        : direction === "left"
        ? "translateX"
        : "translateX";

    const initialValue =
      direction === "up"
        ? distance
        : direction === "down"
        ? -distance
        : direction === "left"
        ? distance
        : -distance;

    anime.set(elements, {
      opacity: 0,
      [translateProperty]: initialValue,
    });

    anime({
      targets: elements,
      opacity: 1,
      [translateProperty]: 0,
      duration,
      delay: anime.stagger(staggerDelay, { start: delay }),
      easing: "easeOutCubic",
    });
  }

  // Cleanup method
  destroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }
}

// Create global instance
export const animationManager = new AnimationManager();
