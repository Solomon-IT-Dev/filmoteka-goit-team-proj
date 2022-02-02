import refs from './refs';

refs.buttonHome.addEventListener('click', addBlackHeader);
refs.buttonMyLibrary.addEventListener('click', addRedHeader);

function addBlackHeader () {
  refs.headerContainer.classList.remove('header-container-red');
  refs.headerContainer.classList.add('header-container-black');

  refs.headerEl.classList.add('header-black');
  refs.headerEl.classList.remove('header-red');

  refs.buttonMyLibrary.classList.remove('current');
  refs.buttonHome.classList.add('current');

  refs.headerForm.classList.remove('visually-hidden');
  refs.libraryButtons.classList.add('visually-hidden');

  togglePagination("visually-hidden", !(refs.buttonHome.classList.contains("current")) );
};

function addRedHeader () {
  refs.headerContainer.classList.remove('header-container-black');
  refs.headerContainer.classList.add('header-container-red');

  refs.headerEl.classList.remove('header-black');
  refs.headerEl.classList.add('header-red');

  refs.buttonHome.classList.remove('current');
  refs.buttonMyLibrary.classList.add('current');

  refs.libraryButtons.classList.remove('visually-hidden');
  refs.headerForm.classList.add('visually-hidden');

  refs.errorMessageEl.classList.add('visually-hidden');

  togglePagination("visually-hidden", !(refs.buttonHome.classList.contains("current")) );
};


function togglePagination(invisibleClass = "visually-hidden", hidePagination = false) {
  refs.paginationElement.classList.toggle(invisibleClass, hidePagination);
}
