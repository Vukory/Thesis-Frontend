class MultipleChoice extends HTMLElement {
    /** @type {HTMLInputElement=} */
    #otherCheckbox;
    /** @type {HTMLInputElement=} */
    #otherText;

    connectedCallback() {
      this.#otherCheckbox = this.querySelector('.other-checkbox');

      if (!this.#otherCheckbox) {
        return;
      }

      this.#otherText = this.querySelector('.other-text');

      this.#otherCheckbox.addEventListener('click', () => {
        if (this.#otherCheckbox.checked) {
          this.#otherText.focus();
        }
      });

      this.#otherText.addEventListener('input', () => {
        this.#otherCheckbox.checked = true;
      });
    }
  }

  customElements.define('vuko-multiple-choice', MultipleChoice);
const { search } = window.location;
  const urlSearchParams = new URLSearchParams(search);
  const variant = urlSearchParams.get('utm_content');

  if (variant) {
    const form = /** @type {HTMLFormElement} */ (document.querySelector('form'));
    form.action += `?utm_content=${encodeURIComponent(variant)}`;
  }