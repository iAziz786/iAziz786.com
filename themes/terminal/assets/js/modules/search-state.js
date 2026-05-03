/**
 * Search State
 * Immutable value object for search state
 */

import { StateManager } from './utils.js';

export const SearchMode = Object.freeze({
  INSERT: 'insert',
  NORMAL: 'normal'
});

export class SearchState {
  #state;

  constructor() {
    this.#state = StateManager.create({
      data: [],
      selectedIndex: -1,
      isOpen: false,
      mode: SearchMode.NORMAL,
      query: ''
    });
  }

  get data() { return this.#state.get('data'); }
  get selectedIndex() { return this.#state.get('selectedIndex'); }
  get isOpen() { return this.#state.get('isOpen'); }
  get mode() { return this.#state.get('mode'); }
  get query() { return this.#state.get('query'); }

  setData(data) {
    this.#state.set({ data: [...data] });
  }

  setOpen(isOpen) {
    this.#state.set({ isOpen });
  }

  setMode(mode) {
    this.#state.set({ mode });
  }

  setQuery(query) {
    this.#state.set({ query });
  }

  selectIndex(index, maxIndex) {
    const selectedIndex = Math.max(0, Math.min(index, maxIndex));
    this.#state.set({ selectedIndex });
    return selectedIndex;
  }

  navigate(direction, itemCount) {
    if (itemCount === 0) return -1;
    const newIndex = this.selectedIndex + direction;
    return this.selectIndex(newIndex, itemCount - 1);
  }

  reset() {
    this.#state.set({
      selectedIndex: -1,
      query: '',
      mode: SearchMode.NORMAL
    });
  }
}
