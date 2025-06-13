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
          <p class="statement-text typing-animation" data-animation="typeWriter">Innovative AI-powered anemia detection technology applied to tackle real-world healthcare challenges.</p>
        </div>
      </div>

      <!-- What can Anevia do for you Section -->
      <div class="what-can-anevia-do" data-animation="fadeInUp">
        <div class="container">
          <div class="what-can-anevia-content">
            <div class="what-can-anevia-text">
              <h2 class="what-can-anevia-title">What can Anevia <span class="title-highlight">do for you?</span></h2>
              <p class="what-can-anevia-description">
                Anevia revolutionizes anemia detection by providing fast, accurate, and non-invasive screening through advanced AI technology. Our innovative approach makes healthcare more accessible and convenient for everyone.
              </p>

              <div class="capabilities-list">
                <div class="capability-item expanded" data-animation="slideInUp">
                  <div class="capability-header" data-capability="1">
                    <div class="capability-number">1.</div>
                    <div class="capability-title-container">
                      <h3 class="capability-title">Instant AI-Powered Analysis</h3>
                      <div class="capability-toggle">
                        <i class="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                  <div class="capability-description-container">
                    <p class="capability-description">
                      Get immediate anemia screening results through our advanced machine learning algorithms that analyze eye conjunctiva patterns with medical-grade accuracy.
                    </p>
                  </div>
                </div>

                <div class="capability-item" data-animation="slideInUp">
                  <div class="capability-header" data-capability="2">
                    <div class="capability-number">2.</div>
                    <div class="capability-title-container">
                      <h3 class="capability-title">Non-Invasive Detection Technology</h3>
                      <div class="capability-toggle">
                        <i class="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                  <div class="capability-description-container">
                    <p class="capability-description">
                      Experience painless screening without needles or blood samples. Simply capture an image of your eye using any smartphone or camera device.
                    </p>
                  </div>
                </div>

                <div class="capability-item" data-animation="slideInUp">
                  <div class="capability-header" data-capability="3">
                    <div class="capability-number">3.</div>
                    <div class="capability-title-container">
                      <h3 class="capability-title">Comprehensive Health Insights</h3>
                      <div class="capability-toggle">
                        <i class="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                  <div class="capability-description-container">
                    <p class="capability-description">
                      Receive detailed analysis reports with personalized recommendations and guidance for maintaining optimal iron levels and overall health.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="what-can-anevia-image">
              <div class="eye-image-container">
                <img src="/src/assets/Eye-face.jpg" alt="Eye analysis for anemia detection" class="eye-analysis-image" />
                <div class="analysis-overlay">
                  <div class="analysis-point point-1"></div>
                  <div class="analysis-point point-2"></div>
                  <div class="analysis-point point-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="features" data-animation="fadeInUp">
        <div class="container">
          <div class="features-header">
            <h2 class="section-title">Why Choose Anevia?</h2>
            <p class="section-subtitle">Discover the advantages that make Anevia the leading choice for non-invasive anemia detection technology.</p>
          </div>

          <div class="bento-grid" data-animation="staggerFadeIn">
            <!-- Quick & Easy Detection - Large Card -->
            <div class="bento-card bento-card-large" data-animation="scaleIn">
              <div class="bento-content">
                <div class="bento-header">
                  <div class="bento-icon">
                    <i class="fas fa-eye"></i>
                  </div>
                  <h3 class="bento-title">Quick & Easy Detection</h3>
                </div>
                <p class="bento-description">
                  Detect anemia in seconds with just a photo of your eye. Our AI analyzes conjunctiva color patterns to provide instant, accurate results without any invasive procedures.
                </p>
                <div class="bento-stats">
                  <div class="stat-item">
                    <span class="stat-number">< 30s</span>
                    <span class="stat-label">Analysis Time</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">95%</span>
                    <span class="stat-label">Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Real-time Analysis -->
            <div class="bento-card bento-card-medium" data-animation="scaleIn">
              <div class="bento-content">
                <div class="notification-demo">
                  <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                  </div>
                  <div class="notification-content">
                    <h4>Analysis Complete!</h4>
                    <p>Your scan results are ready</p>
                    <span class="notification-time">Just now</span>
                  </div>
                </div>
                <h3 class="bento-title">Real-time Analysis & Alerts</h3>
                <p class="bento-description">
                  Get instant notifications when your analysis is complete with detailed results and personalized recommendations.
                </p>
              </div>
            </div>

            <!-- Mobile Scanning -->
            <div class="bento-card bento-card-small" data-animation="scaleIn">
              <div class="bento-content">
                <div class="mobile-demo">
                  <div class="phone-frame">
                    <div class="camera-viewfinder">
                      <div class="scan-overlay"></div>
                    </div>
                  </div>
                </div>
                <h3 class="bento-title">Mobile-First Design</h3>
                <p class="bento-description">Optimized for smartphones with intuitive camera integration.</p>
              </div>
            </div>

            <!-- Fast Results -->
            <div class="bento-card bento-card-small" data-animation="scaleIn">
              <div class="bento-content">
                <div class="speed-icon-container">
                  <div class="speed-icon">
                    <i class="fas fa-bolt"></i>
                  </div>
                </div>
                <h3 class="bento-title">Lightning Fast</h3>
                <p class="bento-description">Get your anemia screening results in under 30 seconds.</p>
                <div class="speed-indicator">
                    <div class="speed-bar">
                      <div class="speed-fill"></div>
                    </div>
                    <span class="speed-text">< 30s</span>
                  </div>
              </div>
            </div>

            <!-- AI Consultation -->
            <div class="bento-card bento-card-wide" data-animation="scaleIn">
              <div class="bento-content">
                <div class="ai-consultation-demo">
                  <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                  </div>
                  <div class="chat-bubble-grid">
                    <p>Berdasarkan hasil scan Anda, saya merekomendasikan untuk meningkatkan asupan zat besi...</p>
                  </div>
                </div>
                <h3 class="bento-title">Konsultasi dengan AI</h3>
                <p class="bento-description">
                  Dapatkan saran kesehatan personal dari AI assistant yang dapat membantu menganalisis hasil scan dan memberikan rekomendasi yang tepat.
                </p>
              </div>
            </div>

            <!-- Secure Data -->
            <div class="bento-card bento-card-small" data-animation="scaleIn">
              <div class="bento-content">
                <div class="security-icon-container">
                  <div class="security-icon">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                </div>
                <h3 class="bento-title">Secure & Private</h3>
                <p class="bento-description">Your health data is encrypted and protected with enterprise-grade security.</p>
                
              </div>
            </div>

            <!-- Easy to Use -->
            <div class="bento-card bento-card-small" data-animation="scaleIn">
              <div class="bento-content">
                <div class=ease-icon-container>
                    <div class="ease-icon">
                      <i class="fas fa-hand-point-up"></i>
                    </div>
                </div>
                <h3 class="bento-title">Easy to Use</h3>
                <p class="bento-description">Simple one-tap scanning with intuitive interface designed for everyone.</p>
                <div class="ease-steps">
                  <div class="step-dot active"></div>
                  <div class="step-dot active"></div>
                  <div class="step-dot active"></div>
                </div>
              </div>
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

    // Setup capability accordion functionality
    this.setupCapabilityAccordion();
  }

  initializeAnimations() {
    // Trigger hero section animations immediately
    setTimeout(() => {
      animationManager.animateHeroSection();
    }, 100);

    // Trigger typing animation for statement text after hero animation
    setTimeout(() => {
      const statementText = document.querySelector(
        '.statement-text[data-animation="typeWriter"]'
      );
      if (statementText && !statementText.classList.contains("animated")) {
        animationManager.typeWriter(statementText);
        statementText.classList.add("animated");
      }
    }, 1500); // Start typing after hero animation completes

    // Setup scroll-triggered animations for other sections
    animationManager.observeElements("[data-animation]");
  }

  setupCapabilityAccordion() {
    // Get all capability headers
    const capabilityHeaders = document.querySelectorAll(".capability-header");

    capabilityHeaders.forEach((header) => {
      header.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const capabilityItem = header.closest(".capability-item");
        const isExpanded = capabilityItem.classList.contains("expanded");

        // Close all other capability items
        document.querySelectorAll(".capability-item").forEach((item) => {
          if (item !== capabilityItem) {
            item.classList.remove("expanded");
          }
        });

        // Toggle current item
        if (isExpanded) {
          capabilityItem.classList.remove("expanded");
        } else {
          capabilityItem.classList.add("expanded");
        }

        // Add a small delay for smooth animation
        setTimeout(() => {
          // Optional: scroll to item if needed
          if (!isExpanded) {
            const rect = capabilityItem.getBoundingClientRect();
            const isVisible =
              rect.top >= 0 && rect.bottom <= window.innerHeight;

            if (!isVisible) {
              capabilityItem.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        }, 200);
      });
    });
  }

  update(data) {
    // Update view if needed based on data changes
  }
}
