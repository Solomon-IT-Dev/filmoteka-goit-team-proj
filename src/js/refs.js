const refs = {
    //Header
    headerContainer: document.querySelector('.header-container'),
    headerEl: document.querySelector('.header'),
    headerForm: document.querySelector('.header-form'),
    buttonHome: document.querySelector('.button-home'),
    buttonMyLibrary: document.querySelector('.button-mylibrary'),
    libraryButtons: document.querySelector('.library-buttons'),
    buttonWatched: document.querySelector('.library-button__watched'),
    buttonQueue: document.querySelector('.library-button__queue'),
    errorMessageEl: document.querySelector('.error-message'),

    //Pagination
    paginationElement: document.getElementById('tui-pagination-container'),
    //Scroll
    scrollUpwardBtn: document.querySelector('.btn__scroll'),
    // Модальное окно для фильмов
    openModalMovieBtn: document.querySelector('[data-modal-open]'),
    closeModalMovieBtn: document.querySelector('[data-modal-close]'),
    modalMovie: document.querySelector('[data-modal]'),
    backdrop: document.querySelector('.backdrop'),

    // Модальное окно для команды
    openModalTeamBtn: document.querySelector('[data-team-open]'),
    closeModalTeamBtn: document.querySelector('[data-team-close]'),
    modalTeam: document.querySelector('[data-team]'),
    backdropTeam: document.querySelector('.backdrop-team'),
    //main-section
    modalMovieContainer: document.querySelector('.modal-movies'),
    movieGalleryElement: document.querySelector('.films-list'),
    searchFormEl: document.querySelector('.search-form'),
    emptyLibraryMessage: document.querySelector('.empty-library'),

};
  export default refs;