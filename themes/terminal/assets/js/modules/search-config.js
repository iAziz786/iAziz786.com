/**
 * Search Configuration
 * Immutable value object for search settings
 */

import { ValidationUtils } from './utils.js';

export class SearchConfig {
  #config;

  constructor(dataset = {}) {
    this.#config = Object.freeze({
      endpoint: dataset.searchEndpoint || '/index.json',
      minQueryLength: ValidationUtils.parseIntOr(dataset.searchMinLength, 2),
      maxResults: ValidationUtils.parseIntOr(dataset.searchMaxResults, 10),
      ...this.#parseExtraConfig(dataset)
    });
  }

  #parseExtraConfig(dataset) {
    const extra = {};
    Object.keys(dataset).forEach(key => {
      if (key.startsWith('search') && key !== 'searchEndpoint' && key !== 'searchMinLength' && key !== 'searchMaxResults') {
        const configKey = key.replace('search', '').toLowerCase();
        extra[configKey] = dataset[key];
      }
    });
    return extra;
  }

  get endpoint() { return this.#config.endpoint; }
  get minQueryLength() { return this.#config.minQueryLength; }
  get maxResults() { return this.#config.maxResults; }
  get raw() { return this.#config; }
}
