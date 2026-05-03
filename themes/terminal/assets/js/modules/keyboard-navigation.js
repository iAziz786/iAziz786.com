/**
 * Keyboard Navigation Module
 * Handles global shortcuts and vim-like navigation
 */

import { DOMUtils, KeyboardUtils, TimerUtils } from './utils.js';

// ============================================================================
// Configuration
// ============================================================================

class KeyboardConfig {
  #config;

  constructor(config = {}) {
    this.#config = Object.freeze({
      searchSelector: config.searchSelector || '[data-search-overlay]',
      shortcuts: config.shortcuts || {
        h: '/',
        b: '/blog/',
        p: '/projects/',
        a: '/about/'
      },
      scrollStep: 50,
      gTimeout: 1000,
      ...config
    });
  }

  get searchSelector() { return this.#config.searchSelector; }
  get shortcuts() { return this.#config.shortcuts; }
  get scrollStep() { return this.#config.scrollStep; }
  get gTimeout() { return this.#config.gTimeout; }
}

// ============================================================================
// State
// ============================================================================

class GKeyState {
  #lastKeyG = false;
  #clearTimeout = null;

  #setAttribute(active) {
    document.body.dataset.gActive = active ? 'true' : 'false';
  }

  activate(timeoutMs, onExpire) {
    this.#lastKeyG = true;
    this.#setAttribute(true);
    this.#clearTimeout = TimerUtils.createTimeout(() => {
      this.#lastKeyG = false;
      this.#setAttribute(false);
      onExpire?.();
    }, timeoutMs);
  }

  deactivate() {
    this.#lastKeyG = false;
    this.#setAttribute(false);
    if (this.#clearTimeout) {
      this.#clearTimeout();
      this.#clearTimeout = null;
    }
  }

  get isActive() { return this.#lastKeyG; }
}

// ============================================================================
// Actions
// ============================================================================

class ScrollActions {
  static down(amount) {
    window.scrollBy({ top: amount, behavior: 'smooth' });
  }

  static up(amount) {
    window.scrollBy({ top: -amount, behavior: 'smooth' });
  }

  static toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  static toBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}

class NavigationActions {
  static to(url) {
    window.location.href = url;
  }
}

class SearchActions {
  #searchSelector;
  #onOpen;
  #onClose;

  constructor(searchSelector, callbacks) {
    this.#searchSelector = searchSelector;
    this.#onOpen = callbacks.onOpen;
    this.#onClose = callbacks.onClose;
  }

  open() {
    this.#onOpen?.();
  }

  close() {
    this.#onClose?.();
  }
}

// ============================================================================
// Main Controller
// ============================================================================

export class KeyboardNavigation {
  #config;
  #gState;
  #searchActions;
  #ignoreSelectors = ['INPUT', 'TEXTAREA', '[contenteditable]'];

  constructor(config = {}) {
    this.#config = new KeyboardConfig(config);
    this.#gState = new GKeyState();
    this.#searchActions = null;
  }

  init(callbacks = {}) {
    this.#searchActions = new SearchActions(this.#config.searchSelector, callbacks);
    document.addEventListener('keydown', (e) => this.#handleKeyDown(e));
  }

  // --------------------------------------------------------------------------
  // Event Handling
  // --------------------------------------------------------------------------

  #handleKeyDown(event) {
    if (this.#shouldIgnore(event)) return;

    if (this.#handleSearchKey(event)) return;
    if (this.#handleScrollKeys(event)) return;
    if (this.#handleGKeys(event)) return;
  }

  #shouldIgnore(event) {
    if (DOMUtils.shouldIgnoreEvent(event.target, this.#ignoreSelectors)) return true;
    if (document.body.dataset.searchOpen === 'true') return true;
    return false;
  }

  // --------------------------------------------------------------------------
  // Key Handlers
  // --------------------------------------------------------------------------

  #handleSearchKey(event) {
    if (event.key !== '/' || KeyboardUtils.hasModifier(event)) return false;

    event.preventDefault();
    this.#searchActions.open();
    return true;
  }

  #handleScrollKeys(event) {
    if (KeyboardUtils.hasModifier(event)) return false;

    switch (event.key) {
      case 'j':
        event.preventDefault();
        ScrollActions.down(this.#config.scrollStep);
        return true;
      case 'k':
        event.preventDefault();
        ScrollActions.up(this.#config.scrollStep);
        return true;
      case 'G':
        event.preventDefault();
        ScrollActions.toBottom();
        return true;
      default:
        return false;
    }
  }

  #handleGKeys(event) {
    if (event.key === 'g' && !this.#gState.isActive) {
      this.#gState.activate(this.#config.gTimeout);
      return true;
    }

    if (!this.#gState.isActive) return false;

    this.#gState.deactivate();

    if (event.key === 'g') {
      event.preventDefault();
      event.stopImmediatePropagation();
      ScrollActions.toTop();
      return true;
    }

    const shortcut = this.#config.shortcuts[event.key];
    if (shortcut) {
      event.preventDefault();
      event.stopImmediatePropagation();
      NavigationActions.to(shortcut);
      return true;
    }

    return false;
  }
}

export default KeyboardNavigation;
