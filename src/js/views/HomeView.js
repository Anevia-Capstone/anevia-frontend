// Home View for displaying the landing page
import BaseView from "./BaseView.js";
import { animationManager } from "../utils/animations.js";

export default class HomeView extends BaseView {
  constructor() {
    super("home");
    this.activeCategory = "general";
    this.faqData = {
      general: [
        {
          question: "What is Anevia?",
          answer:
            "Anevia is an innovative platform that uses advanced technology to detect anemia through non-invasive eye scanning. Our application analyzes the color of your eye's conjunctiva to identify potential signs of anemia, providing quick and reliable results without the need for blood tests.",
        },
        {
          question: "How does anemia detection through eye scanning work?",
          answer:
            "Our technology works by analyzing the color and characteristics of the conjunctiva (the clear membrane covering the white of the eye). In anemic individuals, the conjunctiva often appears paler due to reduced hemoglobin levels. Our AI algorithm has been trained on thousands of images to accurately detect these subtle color differences that may indicate anemia.",
        },
        {
          question: "Is this a replacement for medical tests?",
          answer:
            "No, Anevia is designed as a screening tool to help identify potential anemia, but it is not a replacement for professional medical diagnosis. If our tool indicates possible anemia, we recommend consulting with a healthcare provider for proper diagnostic testing and treatment.",
        },
      ],
      accuracy: [
        {
          question: "How accurate is Anevia's anemia detection?",
          answer:
            "Based on our clinical studies, Anevia's technology has demonstrated an accuracy rate of approximately 85-90% when compared to traditional blood tests for anemia. However, various factors such as lighting conditions, image quality, and individual variations can affect the results.",
        },
        {
          question: "What factors can affect the accuracy of the results?",
          answer:
            "Several factors can influence the accuracy of our anemia detection, including: poor lighting conditions, low-quality images, incorrect angle of the eye in the photo, certain eye conditions or redness, and recent use of eye drops or medications that may alter the appearance of the conjunctiva.",
        },
        {
          question: "Has this technology been clinically validated?",
          answer:
            "Yes, our technology has undergone clinical validation studies with over 1,000 participants across diverse demographics. These studies compared our AI-based detection method with standard laboratory hemoglobin tests, showing strong correlation between our results and conventional testing methods.",
        },
      ],
      privacy: [
        {
          question: "How is my data protected?",
          answer:
            "We take your privacy seriously. All images and personal data are encrypted and stored securely. We comply with international data protection regulations, and your information is never sold to third parties. You can request deletion of your data at any time through our platform.",
        },
        {
          question: "Are my eye images stored permanently?",
          answer:
            "By default, your eye images are stored for 30 days to allow for result verification and improvement of our algorithms. After this period, the raw images are automatically deleted from our servers. You can also manually delete your images at any time from your account settings.",
        },
        {
          question: "Who has access to my scan results?",
          answer:
            "Only you have access to your scan results by default. You can choose to share your results with healthcare providers through our secure sharing feature. Our research team may use anonymized data for improving the algorithm, but this never includes personally identifiable information.",
        },
      ],
      usage: [
        {
          question: "How do I take a good eye photo for accurate results?",
          answer:
            "For best results: Ensure good, natural lighting (avoid dim light or harsh direct light); Pull down your lower eyelid gently to expose the conjunctiva; Position your eye clearly in the camera frame; Hold steady and take a clear, focused image; Avoid using flash as it can alter the color appearance.",
        },
        {
          question: "Can I use Anevia on any device?",
          answer:
            "Anevia works on most modern smartphones, tablets, and computers with a camera. For optimal results, we recommend using a device with a high-quality camera. The web application is compatible with recent versions of Chrome, Safari, Firefox, and Edge browsers.",
        },
        {
          question: "How often should I check for anemia?",
          answer:
            "For general health monitoring, checking once every 3-6 months is sufficient for most people. However, if you have risk factors for anemia (heavy menstrual periods, known nutritional deficiencies, chronic conditions), more frequent checks may be beneficial. Always follow your healthcare provider's recommendations for your specific situation.",
        },
      ],
    };
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.renderFAQItems(this.activeCategory);
  }

  render() {
    const html = `
      <div class="hero-section">
        <div class="hero-body-container">
          <div class="hero-text-section">
            <div class="hero-title-container">
              <h1 class="hero-title">The Future of Anemia Detection: Empowered by <span class="hero-title-highlight">AI Technology</span></h1>
            </div>
            <div class="hero-cta-container">
              <button class="hero-try-now-btn" id="hero-try-now">
                <span>Try now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="innovation-statement" data-animation="fadeInUp">
        <div class="container">
          <p class="statement-text" data-animation="typeWriter">Innovative AI-powered anemia detection technology applied to tackle real-world healthcare challenges.</p>
        </div>
      </div>

      <div class="features" data-animation="fadeInUp">
        <div class="container">
          <h2 class="section-title">Why Choose Anevia?</h2>
          <div class="features-container" data-animation="staggerFadeIn">
            <div class="feature-card" data-animation="scaleIn">
              <div class="feature-icon">
                <i class="fas fa-bolt"></i>
              </div>
              <h3 class="feature-title">Fast Results</h3>
              <p class="feature-description">Get your anemia screening results in seconds, not days. No more waiting for lab tests.</p>
            </div>

            <div class="feature-card" data-animation="scaleIn">
              <div class="feature-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h3 class="feature-title">Non-Invasive</h3>
              <p class="feature-description">No needles, no blood samples. Just a simple scan of your eye's conjunctiva.</p>
            </div>

            <div class="feature-card" data-animation="scaleIn">
              <div class="feature-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3 class="feature-title">Accurate Detection</h3>
              <p class="feature-description">Our AI-powered technology provides reliable anemia detection with high accuracy.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="how-it-works" data-animation="fadeInUp">
        <div class="container">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Our technology analyzes the color of your eye's conjunctiva to detect signs of anemia, providing quick and reliable results.</p>

          <div class="steps-container" data-animation="staggerFadeIn">
            <div class="step" data-animation="slideInUp">
              <div class="step-number">1</div>
              <h3 class="step-title">Capture</h3>
              <p class="step-description">Take a clear photo of your eye's conjunctiva using your device's camera or upload an existing image.</p>
            </div>

            <div class="step" data-animation="slideInUp">
              <div class="step-number">2</div>
              <h3 class="step-title">Analyze</h3>
              <p class="step-description">Our AI algorithm analyzes the color and characteristics of your conjunctiva.</p>
            </div>

            <div class="step" data-animation="slideInUp">
              <div class="step-number">3</div>
              <h3 class="step-title">Results</h3>
              <p class="step-description">Receive your anemia screening results instantly, with recommendations for next steps.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section" data-animation="faqSection">
        <div class="container faq-container">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">Find answers to common questions about our anemia detection technology.</p>

          <div class="faq-categories">
            <div class="faq-category active" data-category="general">General</div>
            <div class="faq-category" data-category="accuracy">Accuracy</div>
            <div class="faq-category" data-category="privacy">Privacy</div>
            <div class="faq-category" data-category="usage">Usage</div>
          </div>

          <div class="accordion" id="faq-accordion">
            <!-- FAQ items will be inserted here -->
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  setupEventListeners() {
    const heroTryNowBtn = this.findElement("#hero-try-now");

    if (heroTryNowBtn) {
      this.addEventListener(heroTryNowBtn, "click", (e) => {
        e.preventDefault();
        window.location.hash = "tools";
      });
    }

    // Setup FAQ event listeners
    this.setupFAQEventListeners();
  }

  setupFAQEventListeners() {
    // Category switching
    const categories = this.findElements(".faq-category");

    categories.forEach((category) => {
      this.addEventListener(category, "click", () => {
        // Remove active class from all categories
        categories.forEach((cat) => cat.classList.remove("active"));

        // Add active class to clicked category
        category.classList.add("active");

        // Update active category and render items
        this.activeCategory = category.dataset.category;
        this.renderFAQItems(this.activeCategory);
      });
    });

    // Initial accordion setup
    this.setupAccordionListeners();
  }

  renderFAQItems(category) {
    const accordion = this.findElement("#faq-accordion");
    if (!accordion) return;

    const faqItems = this.faqData[category];
    let html = "";

    faqItems.forEach((item) => {
      html += `
        <div class="accordion-item">
          <div class="accordion-header">
            <h3 class="accordion-title">${item.question}</h3>
            <div class="accordion-icon">
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div class="accordion-content" style="max-height: 0">
            <div class="accordion-body">
              ${item.answer}
            </div>
          </div>
        </div>
      `;
    });

    accordion.innerHTML = html;

    // Add event listeners to the new accordion items
    this.setupAccordionListeners();

    // Animate the new FAQ items
    setTimeout(() => {
      const newItems = accordion.querySelectorAll(".accordion-item");
      animationManager.animateStaggerFadeIn(newItems, {
        direction: "left",
        staggerDelay: 100,
        delay: 100,
      });
    }, 50);
  }

  setupAccordionListeners() {
    const accordionItems = this.findElements(".accordion-item");

    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");

      this.addEventListener(header, "click", () => {
        // Check if the clicked item is already active
        const isActive = item.classList.contains("active");

        // Close other items first
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            animationManager.animateAccordionItem(otherItem, false);
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove("active");
          animationManager.animateAccordionItem(item, false);
        } else {
          item.classList.add("active");
          animationManager.animateAccordionItem(item, true);
        }
      });
    });
  }

  onShow() {
    // Scroll to top when showing home page
    window.scrollTo(0, 0);

    // Initialize animations
    this.initializeAnimations();
  }

  initializeAnimations() {
    // Trigger hero section animations immediately
    setTimeout(() => {
      animationManager.animateHeroSection();
    }, 100);

    // Setup scroll-triggered animations for other sections
    animationManager.observeElements("[data-animation]");
  }

  update(data) {
    // Update view if needed based on data changes
    console.log("HomeView update called with data:", data);
  }
}
