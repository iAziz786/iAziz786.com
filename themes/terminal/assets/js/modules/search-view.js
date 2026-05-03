/**
 * Search View
 * Handles all DOM operations for search overlay
 */

import { DOMUtils } from './utils.js';

export class SearchView {
  #element;
  #input;
  #results;
  #focusManager;

  constructor(element) {
    this.#element = element;
    this.#input = DOMUtils.queryRequired(element, '[data-search-input]', 'Search input required');
    this.#results = DOMUtils.queryRequired(element, '[data-search-results]', 'Search results required');
    this.#focusManager = DOMUtils.createFocusManager();
  }

  // --------------------------------------------------------------------------
  // Visibility
  // --------------------------------------------------------------------------

  show() {
    this.#element.classList.add('is-active');
    this.#element.setAttribute('aria-hidden', 'false');
    document.body.dataset.searchOpen = 'true';
    this.#focusManager.save();
  }

  hide() {
    this.#element.classList.remove('is-active');
    this.#element.setAttribute('aria-hidden', 'true');
    delete document.body.dataset.searchOpen;
  }

  // --------------------------------------------------------------------------
  // Input
  // --------------------------------------------------------------------------

  focusInput() {
    this.#input.focus();
  }

  blurInput() {
    this.#input.blur();
  }

  clearInput() {
    this.#input.value = '';
  }

  getInputValue() {
    return this.#input.value;
  }

  // --------------------------------------------------------------------------
  // Results Rendering
  // --------------------------------------------------------------------------

  renderResults(results, selectedIndex = 0) {
    if (results.length === 0) {
      this.#renderEmpty();
      return;
    }
    this.#results.innerHTML = results.map((item, i) => this.#renderItem(item, i, selectedIndex)).join('');
  }

  clearResults() {
    this.#results.innerHTML = '';
  }

  #renderEmpty() {
    this.#results.innerHTML = '<li class="terminal-search__no-results">No results found</li>';
  }

  #renderItem(item, index, selectedIndex) {
    const isSelected = index === selectedIndex ? 'is-selected' : '';
    const title = DOMUtils.escapeHtml(item.title);
    return `
      <li class="terminal-search__result" data-index="${index}">
        <a href="${item.permalink}" class="terminal-search__link ${isSelected}">
          <strong class="terminal-search__title">${title}</strong>
          <time class="terminal-search__date" datetime="${item.date}">${item.date || ''}</time>
        </a>
      </li>
    `;
  }

  // --------------------------------------------------------------------------
  // Selection
  // --------------------------------------------------------------------------

  updateSelection(selectedIndex) {
    const items = this.#results.querySelectorAll('.terminal-search__result');
    items.forEach((item, i) => {
      const link = item.querySelector('.terminal-search__link');
      link.classList.toggle('is-selected', i === selectedIndex);
      if (i === selectedIndex) {
        link.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  getSelectedLink() {
    return this.#results.querySelector('.terminal-search__link.is-selected');
  }

  // --------------------------------------------------------------------------
  // Focus Management
  // --------------------------------------------------------------------------

  restoreFocus() {
    this.#focusManager.restore();
  }

  trapFocus(event) {
    if (event.key !== 'Tab') return;

    const focusable = DOMUtils.getFocusableElements(this.#element);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // --------------------------------------------------------------------------
  // Event Binding
  // --------------------------------------------------------------------------

  onInput(handler) {
    this.#input.addEventListener('input', handler);
  }

  onInputKeydown(handler) {
    this.#input.addEventListener('keydown', handler);
  }

  onInputFocus(handler) {
    this.#input.addEventListener('focus', handler);
  }

  onResultsClick(handler) {
    this.#results.addEventListener('click', handler);
  }

  onElementKeydown(handler) {
    this.#element.addEventListener('keydown', handler);
  }
}
