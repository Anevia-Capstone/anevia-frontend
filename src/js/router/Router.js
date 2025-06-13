// Router class for handling hash-based routing in SPA
export default class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.isStarted = false;
  }

  // Add a route with its handler function
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  // Start the router and listen for hash changes
  start() {
    if (this.isStarted) return;

    this.isStarted = true;

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      this.handleRouteChange();
    });

    // Handle initial route
    this.handleRouteChange();
  }

  // Stop the router
  stop() {
    this.isStarted = false;
    window.removeEventListener("hashchange", this.handleRouteChange.bind(this));
  }

  // Handle route changes
  handleRouteChange() {
    const hash = window.location.hash;
    const route = this.extractRoute(hash);

    if (this.routes.has(route)) {
      this.currentRoute = route;
      this.routes.get(route)();
    } else {
      // Default to home route if route not found
      this.navigate("home");
    }
  }

  // Extract route from hash
  extractRoute(hash) {
    // Remove the # symbol and any query parameters
    let route = hash.replace("#", "");

    // Remove query parameters if any
    const queryIndex = route.indexOf("?");
    if (queryIndex !== -1) {
      route = route.substring(0, queryIndex);
    }

    return route;
  }

  // Navigate to a specific route
  navigate(route) {
    if (route === this.currentRoute) return;

    window.location.hash = route;
  }

  // Get current route
  getCurrentRoute() {
    return this.currentRoute;
  }

  // Get query parameters from current URL
  getQueryParams() {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf("?");

    if (queryIndex === -1) return {};

    const queryString = hash.substring(queryIndex + 1);
    const params = {};

    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    });

    return params;
  }

  // Navigate with query parameters
  navigateWithParams(route, params = {}) {
    let url = route;

    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    if (queryString) {
      url += "?" + queryString;
    }

    window.location.hash = url;
  }

  // Go back in history
  goBack() {
    window.history.back();
  }

  // Go forward in history
  goForward() {
    window.history.forward();
  }
}
