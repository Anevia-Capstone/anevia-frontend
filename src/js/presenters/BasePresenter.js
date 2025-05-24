// Base Presenter class for MVP pattern
export default class BasePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.isActive = false;
    
    // Set up model observer if model exists
    if (this.model && typeof this.model.addObserver === 'function') {
      this.model.addObserver(this);
    }
  }

  // Show the presenter (activate view and model)
  show() {
    this.isActive = true;
    if (this.view) {
      this.view.show();
    }
    this.onShow();
  }

  // Hide the presenter (deactivate view)
  hide() {
    this.isActive = false;
    if (this.view) {
      this.view.hide();
    }
    this.onHide();
  }

  // Called when presenter is shown
  onShow() {
    // Override in subclasses if needed
  }

  // Called when presenter is hidden
  onHide() {
    // Override in subclasses if needed
  }

  // Update method called by model when data changes
  update(data) {
    if (this.view && typeof this.view.update === 'function') {
      this.view.update(data);
    }
    this.onUpdate(data);
  }

  // Called when model data is updated
  onUpdate(data) {
    // Override in subclasses if needed
  }

  // Handle user interactions from view
  handleUserAction(action, data) {
    // Override in subclasses to handle specific actions
    console.log('BasePresenter handleUserAction:', action, data);
  }

  // Get data from model
  getModelData(key) {
    return this.model ? this.model.getData(key) : null;
  }

  // Set data in model
  setModelData(key, value) {
    if (this.model && typeof this.model.setData === 'function') {
      this.model.setData(key, value);
    }
  }

  // Update model data
  updateModelData(data) {
    if (this.model && typeof this.model.updateData === 'function') {
      this.model.updateData(data);
    }
  }

  // Check if presenter is active
  isPresenterActive() {
    return this.isActive;
  }

  // Clean up presenter
  destroy() {
    this.hide();
    
    // Remove observer from model
    if (this.model && typeof this.model.removeObserver === 'function') {
      this.model.removeObserver(this);
    }
    
    // Clean up view
    if (this.view && typeof this.view.destroy === 'function') {
      this.view.destroy();
    }
    
    this.model = null;
    this.view = null;
  }

  // Show loading state
  showLoading(message) {
    if (this.view && typeof this.view.showLoading === 'function') {
      this.view.showLoading(message);
    }
  }

  // Show error state
  showError(message) {
    if (this.view && typeof this.view.showError === 'function') {
      this.view.showError(message);
    }
  }

  // Navigate to another route
  navigate(route) {
    window.location.hash = route;
  }

  // Navigate with parameters
  navigateWithParams(route, params) {
    let url = route;
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    if (queryString) {
      url += '?' + queryString;
    }
    
    window.location.hash = url;
  }
}
