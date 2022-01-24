const buttonHome = document.querySelector('.button-home');

const addBlackHeader = () => {
  document.querySelector('.header-container').classList.remove('header-container-red');
  document.querySelector('.header-container').classList.add('header-container-black');

  document.querySelector('.header').classList.add('header-black');
  document.querySelector('.header').classList.remove('header-red');

  document.querySelector('.button-mylibrary').classList.remove('current');
  document.querySelector('.button-home').classList.add('current');

  document.querySelector('.header-form').classList.remove('visually-hidden');
  document.querySelector('.library-buttons').classList.add('visually-hidden');

  togglePagination("visually-hidden", !(document.querySelector(".button-home").classList.contains("current")) );
};

buttonHome.addEventListener('click', addBlackHeader);

const buttonMyLibrary = document.querySelector('.button-mylibrary');

const addRedHeader = () => {
  document.querySelector('.header-container').classList.remove('header-container-black');
  document.querySelector('.header-container').classList.add('header-container-red');

  document.querySelector('.header').classList.remove('header-black');
  document.querySelector('.header').classList.add('header-red');

  document.querySelector('.button-home').classList.remove('current');
  document.querySelector('.button-mylibrary').classList.add('current');

  document.querySelector('.library-buttons').classList.remove('visually-hidden');
  document.querySelector('.header-form').classList.add('visually-hidden');

  document.querySelector('.error-message').classList.add('visually-hidden');

  togglePagination("visually-hidden", !(document.querySelector(".button-home").classList.contains("current")) );
};

buttonMyLibrary.addEventListener('click', addRedHeader);

function togglePagination(invisibleClass = "visually-hidden", hidePagination = false) {
  const paginationElement = document.getElementById('tui-pagination-container');
  paginationElement.classList.toggle(invisibleClass, hidePagination);
}
