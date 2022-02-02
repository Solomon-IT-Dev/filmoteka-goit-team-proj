export default class Spinner {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.spinner = document.querySelector('.spinner');
    refs.mainSection = document.querySelector('.main-section');

    return refs;
  }

  hide() {
    this.refs.spinner.classList.add('spinner--is-hidden');
    this.refs.mainSection.style.opacity = 1;
  }

  show() {
    this.refs.spinner.classList.remove('spinner--is-hidden');
    this.refs.mainSection.style.opacity = 0;
  }
}

export const spinner = new Spinner({
  hidden: true,
});