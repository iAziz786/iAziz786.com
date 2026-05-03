/**
 * Shared Utilities
 * Pure functions and helpers used across modules
 */

// ============================================================================
// DOM Utilities
// ============================================================================

export const DOMUtils = Object.freeze({
  /**
   * Check if element should be ignored for keyboard events
   * @param {HTMLElement} target
   * @param {string[]} selectors
   * @returns {boolean}
   */
  shouldIgnoreEvent(target, selectors = ['INPUT', 'TEXTAREA', '[contenteditable]']) {
    return selectors.some(selector =>
      selector.startsWith('[') ? target.matches(selector) : target.tagName === selector
    );
  },

  /**
   * Query element with validation
   * @param {HTMLElement} parent
   * @param {string} selector
   * @param {string} errorMessage
   * @returns {HTMLElement}
   */
  queryRequired(parent, selector, errorMessage) {
    const element = parent.querySelector(selector);
    if (!element) throw new Error(errorMessage);
    return element;
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Get all focusable elements within container
   * @param {HTMLElement} container
   * @returns {NodeListOf<HTMLElement>}
   */
  getFocusableElements(container) {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  },

  /**
   * Save and restore focus
   * @returns {{ save: () => void, restore: () => void }}
   */
  createFocusManager() {
    let previouslyFocused = null;
    return Object.freeze({
      save: () => { previouslyFocused = document.activeElement; },
      restore: () => { if (previouslyFocused) previouslyFocused.focus(); }
    });
  }
});

// ============================================================================
// Keyboard Utilities
// ============================================================================

export const KeyboardUtils = Object.freeze({
  /**
   * Check if modifier keys are pressed
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  hasModifier(event) {
    return event.ctrlKey || event.metaKey || event.altKey;
  },

  /**
   * Prevent default and stop propagation
   * @param {Event} event
   */
  suppress(event) {
    event.preventDefault();
    event.stopPropagation();
  }
});

// ============================================================================
// Validation Utilities
// ============================================================================

export const ValidationUtils = Object.freeze({
  /**
   * Validate string is not empty
   * @param {*} value
   * @param {string} name
   * @returns {string}
   */
  requireString(value, name) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(`${name} must be a non-empty string`);
    }
    return value;
  },

  /**
   * Parse integer with fallback
   * @param {*} value
   * @param {number} fallback
   * @returns {number}
   */
  parseIntOr(value, fallback) {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  },

  /**
   * Parse JSON safely
   * @param {string} value
   * @param {*} fallback
   * @returns {*}
   */
  parseJsonOr(value, fallback = null) {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
});

// ============================================================================
// State Management
// ============================================================================

export const StateManager = Object.freeze({
  /**
   * Create immutable state container
   * @param {Object} initialState
   * @returns {{ get: (key?: string) => *, set: (updates: Object) => void }}
   */
  create(initialState = {}) {
    let state = Object.freeze({ ...initialState });
    
    return Object.freeze({
      get(key) {
        return key ? state[key] : state;
      },
      set(updates) {
        state = Object.freeze({ ...state, ...updates });
      }
    });
  }
});

// ============================================================================
// Timer Utilities
// ============================================================================

export const TimerUtils = Object.freeze({
  /**
   * Create debounced function
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   */
  debounce(fn, delay) {
    let timeoutId = null;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Create timeout that auto-clears
   * @param {Function} callback
   * @param {number} delay
   * @returns {() => void} clear function
   */
  createTimeout(callback, delay) {
    const id = setTimeout(callback, delay);
    return () => clearTimeout(id);
  }
});
