/**
 * Blog List Navigation Module
 * Vim-like j/k navigation for blog list pages
 */

import { DOMUtils, KeyboardUtils } from './utils.js';

// ============================================================================
// State
// ============================================================================

class ListNavigationState {
  #selectedIndex = -1;
  #itemCount = 0;

  select(index) {
    this.#selectedIndex = Math.max(0, Math.min(index, this.#itemCount - 1));
    return this.#selectedIndex;
  }

  navigate(direction) {
    return this.select(this.#selectedIndex + direction);
  }

  setItemCount(count) {
    this.#itemCount = count;
  }

  get selectedIndex() { return this.#selectedIndex; }
  get itemCount() { return this.#itemCount; }
}

// ============================================================================
// View
// ============================================================================

class ListNavigationView {
  #items;

  constructor(container) {
    this.#items = container.querySelectorAll('[data-blog-list-item]');
  }

  get items() { return this.#items; }
  get length() { return this.#items.length; }

  selectIndex(index) {
    this.#items.forEach((item, i) => {
      item.classList.toggle('is-selected', i === index);
      if (i === index) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  getLinkAt(index) {
    const item = this.#items[index];
    return item?.querySelector('.terminal-post-list__link');
  }
}

// ============================================================================
// Controller
// ============================================================================

export class BlogListNavigation {
  #view;
  #state;
  #ignoreSelectors = ['INPUT', 'TEXTAREA', '[contenteditable]'];

  constructor() {
    const container = document.querySelector('[data-blog-list]');
    if (!container) return;

    this.#view = new ListNavigationView(container);
    if (this.#view.length === 0) return;

    this.#state = new ListNavigationState();
    this.#state.setItemCount(this.#view.length);
    this.#init();
  }

  #init() {
    this.#select(0);
    document.addEventListener('keydown', (e) => this.#handleKeyDown(e));
  }

  #handleKeyDown(event) {
    if (this.#shouldIgnore(event)) return;

    switch (event.key) {
      case 'j':
        event.preventDefault();
        this.#selectNext();
        break;
      case 'k':
        event.preventDefault();
        this.#selectPrev();
        break;
      case 'Enter':
        event.preventDefault();
        this.#openSelected();
        break;
    }
  }

  #shouldIgnore(event) {
    if (DOMUtils.shouldIgnoreEvent(event.target, this.#ignoreSelectors)) return true;
    if (document.body.dataset.searchOpen === 'true') return true;
    if (KeyboardUtils.hasModifier(event)) return true;
    return false;
  }

  #select(index) {
    const actualIndex = this.#state.select(index);
    this.#view.selectIndex(actualIndex);
  }

  #selectNext() {
    this.#select(this.#state.selectedIndex + 1);
  }

  #selectPrev() {
    this.#select(this.#state.selectedIndex - 1);
  }

  #openSelected() {
    const link = this.#view.getLinkAt(this.#state.selectedIndex);
    if (link) {
      window.location.href = link.href;
    }
  }
}

export default BlogListNavigation;
