/**
 * Search Keyboard Handler
 * Handles all keyboard interactions for search
 */

import { KeyboardUtils } from './utils.js';
import { SearchMode } from './search-state.js';

export class SearchKeyboardHandler {
  #state;
  #view;
  #onClose;
  #onModeChange;
  #onNavigate;
  #onSelect;

  constructor(state, view, callbacks) {
    this.#state = state;
    this.#view = view;
    this.#onClose = callbacks.onClose;
    this.#onModeChange = callbacks.onModeChange;
    this.#onNavigate = callbacks.onNavigate;
    this.#onSelect = callbacks.onSelect;
  }

  // --------------------------------------------------------------------------
  // Insert Mode (input focused)
  // --------------------------------------------------------------------------

  handleInsertKeydown(event) {
    switch (event.key) {
      case 'Escape':
        KeyboardUtils.suppress(event);
        this.#onModeChange(SearchMode.NORMAL);
        return true;
      case 'ArrowDown':
        KeyboardUtils.suppress(event);
        this.#onNavigate(1);
        return true;
      case 'ArrowUp':
        KeyboardUtils.suppress(event);
        this.#onNavigate(-1);
        return true;
      case 'Enter':
        KeyboardUtils.suppress(event);
        this.#onSelect();
        return true;
      default:
        return false;
    }
  }

  // --------------------------------------------------------------------------
  // Normal Mode (vim-like)
  // --------------------------------------------------------------------------

  handleNormalKeydown(event) {
    if (!this.#state.isOpen || this.#state.mode === SearchMode.INSERT) return false;

    switch (event.key) {
      case 'j':
        event.preventDefault();
        this.#onNavigate(1);
        return true;
      case 'k':
        event.preventDefault();
        this.#onNavigate(-1);
        return true;
      case 'Enter':
        event.preventDefault();
        this.#onSelect();
        return true;
      case 'Escape':
      case 'q':
        event.preventDefault();
        this.#onClose();
        return true;
      case 'i':
      case '/':
        event.preventDefault();
        this.#onModeChange(SearchMode.INSERT);
        return true;
      default:
        return false;
    }
  }
}
