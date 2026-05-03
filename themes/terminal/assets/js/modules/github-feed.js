/**
 * GitHub Feed Module
 * Fetches and displays recent GitHub commits
 */

import { ValidationUtils, DOMUtils } from './utils.js';

// ============================================================================
// Configuration
// ============================================================================

class GitHubConfig {
  #user;
  #reposCount;
  #commitsCount;
  #fallbackCommits;

  constructor(dataset) {
    this.#user = ValidationUtils.requireString(dataset.githubUser, 'data-github-user');
    this.#reposCount = ValidationUtils.parseIntOr(dataset.githubReposCount, 5);
    this.#commitsCount = ValidationUtils.parseIntOr(dataset.githubCommitsCount, 3);
    this.#fallbackCommits = this.#parseFallback(dataset.fallbackCommits);
  }

  #parseFallback(fallbackString) {
    return ValidationUtils.parseJsonOr(fallbackString, []);
  }

  get user() { return this.#user; }
  get reposCount() { return this.#reposCount; }
  get commitsCount() { return this.#commitsCount; }
  get fallbackCommits() { return this.#fallbackCommits; }

  get reposUrl() {
    return `https://api.github.com/users/${this.#user}/repos?sort=pushed&per_page=${this.#reposCount}`;
  }

  getCommitsUrl(repoFullName) {
    return `https://api.github.com/repos/${repoFullName}/commits?per_page=${this.#commitsCount}`;
  }
}

// ============================================================================
// Data Transfer Objects
// ============================================================================

class CommitDto {
  constructor(date, repo, message) {
    this.date = date;
    this.repo = repo;
    this.message = message;
    Object.freeze(this);
  }

  static fromApi(commit, repoName) {
    const date = commit.commit?.author?.date?.split('T')[0] || 'unknown';
    const message = commit.commit?.message?.split('\n')[0] || 'no message';
    return new CommitDto(date, repoName, message);
  }

  static fromFallback(data) {
    return new CommitDto(data.date || 'unknown', data.repo || 'unknown', data.message || '');
  }
}

// ============================================================================
// API Service
// ============================================================================

class GitHubApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class GitHubApiService {
  #config;

  constructor(config) {
    this.#config = config;
  }

  async fetchCommits() {
    const repos = await this.#fetchRepos();
    if (repos.length === 0) throw new GitHubApiError('No repositories found', 404);

    const activeRepo = repos[0];
    const commits = await this.#fetchRepoCommits(activeRepo.full_name);

    return commits.map(c => CommitDto.fromApi(c, activeRepo.name));
  }

  async #fetchRepos() {
    const response = await fetch(this.#config.reposUrl);
    if (!response.ok) {
      throw new GitHubApiError(`Failed to fetch repos: ${response.status}`, response.status);
    }
    const repos = await response.json();
    return Array.isArray(repos) ? repos : [];
  }

  async #fetchRepoCommits(repoFullName) {
    const response = await fetch(this.#config.getCommitsUrl(repoFullName));
    if (!response.ok) {
      throw new GitHubApiError(`Failed to fetch commits: ${response.status}`, response.status);
    }
    const commits = await response.json();
    return Array.isArray(commits) ? commits : [];
  }
}

// ============================================================================
// View
// ============================================================================

class GitHubFeedView {
  #element;

  constructor(element) {
    this.#element = element;
  }

  render(commits) {
    if (commits.length === 0) {
      this.#renderEmpty();
      return;
    }
    this.#element.innerHTML = commits.map(c => this.#renderCommit(c)).join('');
  }

  renderError() {
    this.#renderEmpty();
  }

  #renderEmpty() {
    this.#element.innerHTML = '<p class="terminal-github-feed__empty">No recent commits</p>';
  }

  #renderCommit(commit) {
    const shortMsg = commit.message.length > 45
      ? commit.message.slice(0, 45) + '...'
      : commit.message;
    const escapedMsg = DOMUtils.escapeHtml(shortMsg);
    return `<p class="terminal-github-feed__commit">[${commit.date}] ${commit.repo}: ${escapedMsg}</p>`;
  }
}

// ============================================================================
// Controller
// ============================================================================

export class GitHubFeed {
  #config;
  #service;
  #view;

  constructor(element) {
    if (!element) throw new Error('GitHubFeed: element is required');

    this.#config = new GitHubConfig(element.dataset);
    this.#service = new GitHubApiService(this.#config);
    this.#view = new GitHubFeedView(element);

    this.#init();
  }

  async #init() {
    try {
      const commits = await this.#service.fetchCommits();
      this.#view.render(commits);
    } catch (err) {
      console.warn('GitHub feed error:', err.message);
      this.#view.render(this.#config.fallbackCommits.map(c => CommitDto.fromFallback(c)));
    }
  }
}

export default GitHubFeed;
