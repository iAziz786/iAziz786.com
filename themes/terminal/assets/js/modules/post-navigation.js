/**
 * Post Navigation Module
 * Handles h/l keys for blog post navigation
 */

import { DOMUtils, KeyboardUtils } from './utils.js';

// ============================================================================
// Configuration
// ============================================================================

class PostNavConfig {
  #prevUrl;
  #nextUrl;
  #enabled;

  constructor(config = {}) {
    this.#prevUrl = config.prevUrl || null;
    this.#nextUrl = config.nextUrl || null;
    this.#enabled = config.enabled || false;
  }

  get prevUrl() { return this.#prevUrl; }
  get nextUrl() { return this.#nextUrl; }
  get enabled() { return this.#enabled; }
  get hasPrev() { return !!this.#prevUrl; }
  get hasNext() { return !!this.#nextUrl; }
}

// ============================================================================
// Navigation Actions
// ============================================================================

class PostNavActions {
  static to(url) {
    window.location.href = url;
  }
}

// ============================================================================
// Controller
// ============================================================================

export class PostNavigation {
  #config;
  #ignoreSelectors = ['INPUT', 'TEXTAREA', '[contenteditable]'];

  constructor(config = {}) {
    this.#config = new PostNavConfig(config);
    if (!this.#config.enabled) return;

    this.#init();
  }

  #init() {
    document.addEventListener('keydown', (e) => this.#handleKeyDown(e));
  }

  #handleKeyDown(event) {
    if (this.#shouldIgnore(event)) return;
    if (document.body.dataset.gActive === 'true') return;

    if (event.key === 'h' && this.#config.hasPrev) {
      event.preventDefault();
      PostNavActions.to(this.#config.prevUrl);
    } else if (event.key === 'l' && this.#config.hasNext) {
      event.preventDefault();
      PostNavActions.to(this.#config.nextUrl);
    }
  }

  #shouldIgnore(event) {
    if (DOMUtils.shouldIgnoreEvent(event.target, this.#ignoreSelectors)) return true;
    if (KeyboardUtils.hasModifier(event)) return true;
    if (document.body.dataset.searchOpen === 'true') return true;
    return false;
  }
}

export default PostNavigation;
