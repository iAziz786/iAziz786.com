/**
 * Code Copy Module
 * Shows the copy button on fenced code blocks (see render-codeblock.html)
 * and copies the block's text to the clipboard.
 */

const RESET_DELAY_MS = 2000;

export class CodeCopy {
  constructor(root = document) {
    if (!navigator.clipboard) return;

    root.querySelectorAll('[data-code-copy]').forEach((button) => {
      const code = button.closest('.terminal-code')?.querySelector('pre code');
      if (!code) return;

      button.querySelector('.terminal-code__copy-label').textContent = 'copy';
      button.hidden = false;
      button.addEventListener('click', () => this.#copy(button, code));
    });
  }

  async #copy(button, code) {
    const label = button.querySelector('.terminal-code__copy-label');
    try {
      await navigator.clipboard.writeText(code.textContent.replace(/\n$/, ''));
      this.#setState(button, label, 'copied');
    } catch {
      this.#setState(button, label, 'failed');
    }
  }

  #setState(button, label, state) {
    button.dataset.state = state;
    label.textContent = state === 'copied' ? 'copied' : 'copy failed';
    clearTimeout(button.resetTimer);
    button.resetTimer = setTimeout(() => {
      delete button.dataset.state;
      label.textContent = 'copy';
    }, RESET_DELAY_MS);
  }
}
