// Footer component

export default class Footer {
  constructor() {
    this.footer = document.getElementById('footer');
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const currentYear = new Date().getFullYear();

    this.footer.innerHTML = `
      <div class="footer-wrapper">
        <!-- Large background text -->
        <div class="footer-background-text">ANEVIA</div>

        <div class="container">
          <div class="footer-content">
            <div class="footer-section footer-brand">
              <h3 class="footer-brand-title">ANEVIA</h3>
              <p class="footer-description">Anevia Menggunakan Teknologi Artificial Intelligence Untuk Deteksi Anemia</p>
              <div class="social-links">
                <a href="https://github.com/Anevia-Capstone" class="social-link" aria-label="GitHub">
                  <i class="fab fa-github"></i>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link" aria-label="Facebook">
                  <i class="fab fa-facebook"></i>
                </a>
              </div>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Internal</h3>
              <ul class="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#scan-history">Chat</a></li>
                <li><a href="#tools">Tools</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Komunitas</h3>
              <ul class="footer-links">
                <li><a href="#">Telegram Grup</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Event</a></li>
                <li><a href="#">Kontrak</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Resources</h3>
              <ul class="footer-links">
                <li><a href="#">Get Involved</a></li>
                <li><a href="#">Press Releases</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="copyright">
              <p>&copy; ${currentYear} Anevia All rights reserved.</p>
            </div>
           
          </div>
        </div>
      </div>
    `;
  }
}
