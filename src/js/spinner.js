export default class Spinner {
  constructor({ selector, hidden = true }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.spinner = document.querySelector('.spinner');
    refs.mainSection = document.querySelector('main-section');

    return refs;
  }

  hide() {
    this.refs.spinner.classList.add('visually-hidden');
    document.mainSection.style.opacity = 1;
  }

  show() {
    this.refs.spinner.classList.remove('visually-hidden');
    document.mainSection.style.opacity = 0;
  }
}
