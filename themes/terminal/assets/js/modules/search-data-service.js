/**
 * Search Data Service
 * Handles fetching and filtering search data
 */

export class SearchDataService {
  #endpoint;
  #data;

  constructor(endpoint) {
    this.#endpoint = endpoint;
    this.#data = [];
  }

  async load() {
    try {
      const response = await fetch(this.#endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      this.#data = json.items || [];
      return [...this.#data];
    } catch (err) {
      console.warn('Search data load failed:', err.message);
      this.#data = [];
      return [];
    }
  }

  search(query, maxResults) {
    const q = query.toLowerCase();
    return this.#data
      .filter(item => this.#matches(item, q))
      .slice(0, maxResults);
  }

  #matches(item, query) {
    return (
      item.title?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query) ||
      item.tags?.some(t => t.toLowerCase().includes(query))
    );
  }
}
