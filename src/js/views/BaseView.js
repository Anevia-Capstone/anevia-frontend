// Base View class for MVP pattern
export default class BaseView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isVisible = false;
    this.eventListeners = [];
  }

  // Render the view
  render(data = {}) {
    throw new Error('render() method must be implemented by subclass');
  }

  // Show the view
  show() {
    if (this.container) {
      this.container.style.display = '';
      this.isVisible = true;
      this.onShow();
    }
  }

  // Hide the view
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
      this.onHide();
    }
  }

  // Called when view is shown
  onShow() {
    // Override in subclasses if needed
  }

  // Called when view is hidden
  onHide() {
    // Override in subclasses if needed
  }

  // Add event listener and track it for cleanup
  addEventListener(element, event, handler) {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    }
  }

  // Remove all event listeners
  removeAllEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element && typeof element.removeEventListener === 'function') {
        element.removeEventListener(event, handler);
      }
    });
    this.eventListeners = [];
  }

  // Create element with attributes and content
  createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
      if (key === 'className') {
        element.className = attributes[key];
      } else if (key === 'innerHTML') {
        element.innerHTML = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
    
    if (content) {
      element.textContent = content;
    }
    
    return element;
  }

  // Find element within the view container
  findElement(selector) {
    return this.container ? this.container.querySelector(selector) : null;
  }

  // Find all elements within the view container
  findElements(selector) {
    return this.container ? this.container.querySelectorAll(selector) : [];
  }

  // Update view with new data
  update(data) {
    // Override in subclasses if needed
    console.log('BaseView update called with data:', data);
  }

  // Clean up the view
  destroy() {
    this.removeAllEventListeners();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  // Check if view is visible
  isViewVisible() {
    return this.isVisible;
  }

  // Set container content
  setContent(html) {
    if (this.container) {
      this.container.innerHTML = html;
    }
  }

  // Append content to container
  appendContent(html) {
    if (this.container) {
      this.container.innerHTML += html;
    }
  }

  // Show loading state
  showLoading(message = 'Loading...') {
    this.setContent(`
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-message">${message}</p>
      </div>
    `);
  }

  // Show error state
  showError(message = 'An error occurred') {
    this.setContent(`
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-message">${message}</p>
      </div>
    `);
  }
}
