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
const IGNORED_FIELDS = ['email', 'altcha'];

  const { search } = window.location;
  const urlSearchParams = new URLSearchParams(search);
  const variant = urlSearchParams.get('utm_content');
  const form =/** @type {HTMLFormElement} */ (document.getElementById('form'));

  if (variant) {
    form.action += `?utm_content=${encodeURIComponent(variant)}`;
  }

  form.addEventListener('submit', (event) => {
    const data = new FormData(form);
    let isValid = false;

    for (const [k, v] of data.entries()) {
      if (IGNORED_FIELDS.includes(k)){
        continue;
      }

      if (v !== null && v !== undefined && v !== '') {
        isValid = true;
      }
    }

    if (!isValid) {
      event.preventDefault();
      const submit = /** @type {HTMLButtonElement} */(document.getElementById('submit'));
      submit.setCustomValidity('Please answer at least one of the questions.');
      form.reportValidity();
    }
  });

  const controls = form.elements;
  
  for (const control of controls) {
    control.addEventListener('change', () => {
      submit.setCustomValidity('');
    });
  }