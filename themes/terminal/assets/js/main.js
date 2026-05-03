/**
 * Main Entry Point
 * Initializes all modules with dependency injection
 */

import { KeyboardNavigation } from './modules/keyboard-navigation.js';
import { SearchController } from './modules/search.js';
import { PostNavigation } from './modules/post-navigation.js';
import { BlogListNavigation } from './modules/blog-list-navigation.js';
import { GitHubFeed } from './modules/github-feed.js';
import { ValidationUtils } from './modules/utils.js';

// ============================================================================
// Configuration
// ============================================================================

class AppConfig {
  static fromBody() {
    const body = document.body;
    const config = ValidationUtils.parseJsonOr(body.dataset.config, {});

    return Object.freeze({
      shortcuts: config.shortcuts || {
        h: '/',
        b: '/blog/',
        p: '/projects/',
        a: '/about/'
      },
      postNav: body.dataset.postNav === 'true',
      postPrevUrl: body.dataset.postPrevUrl || null,
      postNextUrl: body.dataset.postNextUrl || null
    });
  }
}

// ============================================================================
// Module Initializers
// ============================================================================

class SearchInitializer {
  static create(config, callbacks) {
    const element = document.querySelector('[data-search-overlay]');
    if (!element) return null;

    const controller = new SearchController(element);
    controller.init();

    return {
      open: () => controller.open(),
      close: () => controller.close()
    };
  }
}

class KeyboardNavInitializer {
  static create(config, searchApi) {
    const navigation = new KeyboardNavigation({
      searchSelector: '[data-search-overlay]',
      shortcuts: config.shortcuts
    });

    navigation.init({
      onOpen: () => searchApi?.open(),
      onClose: () => searchApi?.close()
    });

    return navigation;
  }
}

class PostNavInitializer {
  static create(config) {
    if (!config.postNav) return null;

    return new PostNavigation({
      prevUrl: config.postPrevUrl,
      nextUrl: config.postNextUrl,
      enabled: true
    });
  }
}

class BlogListInitializer {
  static create() {
    return new BlogListNavigation();
  }
}

class GitHubFeedsInitializer {
  static create() {
    document.querySelectorAll('[data-github-feed]').forEach(element => {
      new GitHubFeed(element);
    });
  }
}

class ImagePolyfillInitializer {
  static create() {
    // "Image" is not a valid custom element name (must contain hyphen)
    // This polyfill is for legacy content and may fail silently
    try {
      if (customElements.get('Image')) return;
      customElements.define('Image', class extends HTMLElement {
        connectedCallback() {
          const src = this.getAttribute('src');
          const alt = this.getAttribute('alt') || '';
          if (!src) return;

          const img = document.createElement('img');
          img.src = src;
          img.alt = alt;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          this.replaceWith(img);
        }
      });
    } catch {
      // Silently ignore - legacy content may not exist
    }
  }
}

// ============================================================================
// Application Bootstrap
// ============================================================================

class Application {
  #config;
  #modules = new Map();

  constructor() {
    this.#config = AppConfig.fromBody();
  }

  init() {
    const searchApi = SearchInitializer.create(this.#config);
    this.#modules.set('search', searchApi);

    const keyboardNav = KeyboardNavInitializer.create(this.#config, searchApi);
    this.#modules.set('keyboardNav', keyboardNav);

    const postNav = PostNavInitializer.create(this.#config);
    if (postNav) this.#modules.set('postNav', postNav);

    BlogListInitializer.create();
    GitHubFeedsInitializer.create();
    ImagePolyfillInitializer.create();
  }
}

// ============================================================================
// Bootstrap
// ============================================================================

function bootstrap() {
  const app = new Application();
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
