/**
 * View Transition Utility
 * Provides helper functions for implementing View Transition API
 */

export class ViewTransitionManager {
  constructor() {
    this.isSupported = 'startViewTransition' in document;
    this.currentTransition = null;
  }

  /**
   * Check if View Transition API is supported
   */
  isViewTransitionSupported() {
    return this.isSupported;
  }

  /**
   * Start a view transition with fallback
   * @param {Function} updateCallback - Function to execute during transition
   * @param {Object} options - Transition options
   */
  async startTransition(updateCallback, options = {}) {
    const {
      fallbackDelay = 0,
      onStart = null,
      onFinish = null,
      onError = null
    } = options;

    try {
      if (onStart) onStart();

      if (this.isSupported) {
        console.log('🎬 Starting View Transition...');
        
        this.currentTransition = document.startViewTransition(async () => {
          await updateCallback();
        });

        await this.currentTransition.finished;
        console.log('✅ View Transition completed');
        
        if (onFinish) onFinish();
      } else {
        console.log('⚠️ View Transition not supported, using fallback');
        
        if (fallbackDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, fallbackDelay));
        }
        
        await updateCallback();
        
        if (onFinish) onFinish();
      }
    } catch (error) {
      console.error('❌ View Transition error:', error);
      if (onError) onError(error);
      
      // Fallback execution
      try {
        await updateCallback();
      } catch (fallbackError) {
        console.error('❌ Fallback execution error:', fallbackError);
      }
    }
  }

  /**
   * Navigate between pages with view transition
   * @param {Function} navigationCallback - Function that performs the navigation
   * @param {Object} options - Navigation options
   */
  async navigateWithTransition(navigationCallback, options = {}) {
    const {
      transitionName = 'page-transition',
      duration = 300
    } = options;

    // Set transition name for the root element
    if (this.isSupported) {
      document.documentElement.style.viewTransitionName = transitionName;
    }

    await this.startTransition(navigationCallback, {
      fallbackDelay: duration,
      onFinish: () => {
        // Clean up transition name
        if (this.isSupported) {
          document.documentElement.style.viewTransitionName = '';
        }
      },
      ...options
    });
  }

  /**
   * Toggle element visibility with view transition
   * @param {HTMLElement} element - Element to toggle
   * @param {Function} toggleCallback - Function that performs the toggle
   * @param {Object} options - Toggle options
   */
  async toggleWithTransition(element, toggleCallback, options = {}) {
    const {
      transitionName = 'element-toggle',
      duration = 300
    } = options;

    // Set transition name for the element
    if (this.isSupported && element) {
      element.style.viewTransitionName = transitionName;
    }

    await this.startTransition(toggleCallback, {
      fallbackDelay: duration,
      onFinish: () => {
        // Clean up transition name
        if (this.isSupported && element) {
          element.style.viewTransitionName = '';
        }
      },
      ...options
    });
  }

  /**
   * Cancel current transition if running
   */
  cancelCurrentTransition() {
    if (this.currentTransition) {
      try {
        this.currentTransition.skipTransition();
        console.log('🛑 View Transition cancelled');
      } catch (error) {
        console.warn('⚠️ Could not cancel transition:', error);
      }
      this.currentTransition = null;
    }
  }

  /**
   * Add transition names to elements for better control
   * @param {Array} elements - Array of {element, name} objects
   */
  setTransitionNames(elements) {
    if (!this.isSupported) return;

    elements.forEach(({ element, name }) => {
      if (element && name) {
        element.style.viewTransitionName = name;
      }
    });
  }

  /**
   * Remove transition names from elements
   * @param {Array} elements - Array of elements
   */
  clearTransitionNames(elements) {
    if (!this.isSupported) return;

    elements.forEach(element => {
      if (element) {
        element.style.viewTransitionName = '';
      }
    });
  }
}

// Create singleton instance
export const viewTransitionManager = new ViewTransitionManager();

// Export convenience functions
export const startViewTransition = (callback, options) => 
  viewTransitionManager.startTransition(callback, options);

export const navigateWithTransition = (callback, options) => 
  viewTransitionManager.navigateWithTransition(callback, options);

export const toggleWithTransition = (element, callback, options) => 
  viewTransitionManager.toggleWithTransition(element, callback, options);

export const isViewTransitionSupported = () => 
  viewTransitionManager.isViewTransitionSupported();
