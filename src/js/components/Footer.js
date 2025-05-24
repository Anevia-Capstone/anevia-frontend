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
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">Anevia</h3>
            <p>Early anemia detection through advanced eye scanning technology.</p>
            <div class="social-links">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Quick Links</h3>
            <ul class="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#tools">Tools</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Contact Us</h3>
            <ul class="footer-links">
              <li><i class="fas fa-map-marker-alt"></i> 123 Health Street, Medical City</li>
              <li><i class="fas fa-phone"></i> +1 234 567 890</li>
              <li><i class="fas fa-envelope"></i> info@anevia.my.id</li>
            </ul>
          </div>
        </div>
        
        <div class="copyright">
          <p>&copy; ${currentYear} Anevia. All rights reserved.</p>
        </div>
      </div>
    `;
  }
}
