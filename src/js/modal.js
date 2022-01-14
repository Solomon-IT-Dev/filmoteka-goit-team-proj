// Осуществление открытия модального окна по кнопке
(() => {
  const refs = {
    // Модальное окно для фильмов
    openModalMovieBtn: document.querySelector('[data-modal-open]'),
    closeModalMovieBtn: document.querySelector('[data-modal-close]'),
    modalMovie: document.querySelector('[data-modal]'),
    // Модальное окно для команды
    openModalTeamBtn: document.querySelector('[data-team-open]'),
    closeModalTeamBtn: document.querySelector('[data-team-close]'),
    modalTeam: document.querySelector('[data-team]'),
  };

  refs.openModalMovieBtn.addEventListener('click', toggleModalMovie);
  refs.closeModalMovieBtn.addEventListener('click', toggleModalMovie);

  function toggleModalMovie() {
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');
  }

  refs.openModalTeamBtn.addEventListener('click', toggleModalTeam);
  refs.closeModalTeamBtn.addEventListener('click', toggleModalTeam);

  function toggleModalTeam() {
    document.body.classList.toggle('modal-open');
    refs.modalTeam.classList.toggle('backdrop--is-hidden');
  }
})();
