/**
 * Search Controller
 * Coordinates search functionality using composition
 */

import { SearchConfig } from './search-config.js';
import { SearchState, SearchMode } from './search-state.js';
import { SearchDataService } from './search-data-service.js';
import { SearchView } from './search-view.js';
import { SearchKeyboardHandler } from './search-keyboard-handler.js';

export class SearchController {
  #config;
  #state;
  #service;
  #view;
  #keyboard;
  #boundGlobalKeydown;

  constructor(element) {
    this.#validateElement(element);
    this.#config = new SearchConfig(element.dataset);
    this.#state = new SearchState();
    this.#service = new SearchDataService(this.#config.endpoint);
    this.#view = new SearchView(element);
    this.#keyboard = this.#createKeyboardHandler();
    this.#boundGlobalKeydown = (e) => this.#keyboard.handleNormalKeydown(e);
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  async init() {
    await this.#service.load();
    this.#bindEvents();
  }

  #validateElement(element) {
    if (!element) throw new Error('SearchController: element is required');
  }

  #createKeyboardHandler() {
    return new SearchKeyboardHandler(this.#state, this.#view, {
      onClose: () => this.close(),
      onModeChange: (mode) => this.#setMode(mode),
      onNavigate: (dir) => this.#navigate(dir),
      onSelect: () => this.#select()
    });
  }

  #bindEvents() {
    this.#view.onInput((e) => this.#handleInput(e.target.value));
    this.#view.onInputKeydown((e) => this.#keyboard.handleInsertKeydown(e));
    this.#view.onInputFocus(() => this.#setMode(SearchMode.INSERT));
    this.#view.onResultsClick((e) => this.#handleResultClick(e));
    this.#view.onElementKeydown((e) => this.#view.trapFocus(e));
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  open() {
    this.#state.setOpen(true);
    this.#view.show();
    this.#setMode(SearchMode.INSERT);
    document.addEventListener('keydown', this.#boundGlobalKeydown);
  }

  close() {
    this.#state.setOpen(false);
    this.#state.reset();
    this.#view.hide();
    this.#view.clearInput();
    this.#view.clearResults();
    this.#view.restoreFocus();
    document.removeEventListener('keydown', this.#boundGlobalKeydown);
  }

  // --------------------------------------------------------------------------
  // Private Methods
  // --------------------------------------------------------------------------

  #setMode(mode) {
    this.#state.setMode(mode);
    if (mode === SearchMode.INSERT) {
      this.#view.focusInput();
    } else {
      this.#view.blurInput();
    }
  }

  #handleInput(query) {
    this.#state.setQuery(query);
    if (query.length < this.#config.minQueryLength) {
      this.#view.clearResults();
      return;
    }
    const results = this.#service.search(query, this.#config.maxResults);
    this.#state.selectIndex(0, Math.max(0, results.length - 1));
    this.#view.renderResults(results, this.#state.selectedIndex);
  }

  #navigate(direction) {
    const items = this.#view.getSelectedLink()?.parentElement?.parentElement?.querySelectorAll('.terminal-search__result');
    const count = items?.length || 0;
    const newIndex = this.#state.navigate(direction, count);
    this.#view.updateSelection(newIndex);
  }

  #select() {
    const link = this.#view.getSelectedLink();
    if (link) window.location.href = link.href;
  }

  #handleResultClick(event) {
    const link = event.target.closest('.terminal-search__link');
    if (link) {
      event.preventDefault();
      window.location.href = link.href;
    }
  }
}

export default SearchController;
