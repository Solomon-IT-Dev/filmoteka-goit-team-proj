//import { renderMovieDetails } from "../index.js";
import { getImagePathFromTMDB } from '../index.js';
const movieGalleryItem = document.querySelector('[data-id]');
import modalMovieTemplate from '../templates/modal-movie-card.hbs';
import mainMovieTemplate from '../templates/main-movie-card.hbs';
const { TmdbUrlHandler } = require('./api-service');
const axios = require('axios').default;
import { scrollUpwardBtn } from './scroll';

// Осуществление открытия модального окна
let movieForRendering;

const filmsArray = [];
const queueArray = [];

const savedDataWathed = localStorage.getItem('watched');
const parsedDataWathed = JSON.parse(savedDataWathed);
if (parsedDataWathed) {
  for (const array of parsedDataWathed) {
    filmsArray.push(array);
  }
}

const savedDataQueue = localStorage.getItem('queue');
const parsedDataQueue = JSON.parse(savedDataQueue);
if (parsedDataQueue) {
  for (const array of parsedDataQueue) {
    queueArray.push(array);
  }
}

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
    modalMovieContainer: document.querySelector('.modal-movies'),
    backdrop: document.querySelector('.backdrop'),
    backdropTeam: document.querySelector('.backdrop-team'),
    movieGalleryElement: document.querySelector('.films-list'),
  };

  // Work of Modal Movie
  refs.backdrop.addEventListener('click', onBackdropClick);
  refs.openModalMovieBtn.addEventListener('click', openModalMovie);
  refs.closeModalMovieBtn.addEventListener('click', closeModalMovie);

  async function renderMovieDetails(movieData) {
    /* Accepts serverResponse.data.results from Axios 
      see https://developers.themoviedb.org/3/movies/get-movie-details for reference */
    //TODO: add markup to event.target based on what movieData has, open modal window

    movieForRendering = { ...movieData };

    if (movieData.poster_path) {
      const movieFullAdress = await getImagePathFromTMDB(movieData.poster_path, 'w780');
      movieForRendering.poster_full_path = movieFullAdress;
    } else {
      movieForRendering.poster_full_path =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
    }
    if (movieData.release_date) {
      movieForRendering.release_year = movieData.release_date.slice(0, 4);
    }

    const genresForRender = movieForRendering.genres
      .slice(0, 3)
      .map(genre => genre.name)
      .sort()
      .join(', ');
    movieForRendering.short_genres = genresForRender;

    refs.modalMovieContainer.innerHTML = '';
    const markup = modalMovieTemplate(movieForRendering);
    refs.modalMovieContainer.insertAdjacentHTML('beforeend', markup);

    //get full image paths in sizes with: await getImagePathFromIMDB()
    // console.log(markup)
    //local-storage

    const buttonAddToWached = document.querySelector('.modal-movies__button-watched');
    buttonAddToWached.addEventListener('click', saveWatchedFilm);

    function saveWatchedFilm() {
      for (const oneFilm of filmsArray) {
        if (oneFilm.id === movieForRendering.id) {
          return;
        }
      }
      const watchedListData = movieForRendering;
      filmsArray.push(watchedListData);

      localStorage.setItem('watched', JSON.stringify(filmsArray));
    }

    const buttonAddToQueue = document.querySelector('.modal-movies__button-queue');
    buttonAddToQueue.addEventListener('click', saveFilmToQueue);

    function saveFilmToQueue() {
      for (const oneFilm of queueArray) {
        if (oneFilm.id === movieForRendering.id) {
          return;
        }
      }
      const queueListData = movieForRendering;
      queueArray.push(queueListData);
      localStorage.setItem('queue', JSON.stringify(queueArray));
    }
  }

  async function showMovieDetails(event = new Event('default')) {
    event.preventDefault();

    if (event.target.nodeName === 'UL') {
      return;
    }
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');
    let cardElement = event.target;
    while (cardElement.nodeName != 'LI') {
      cardElement = cardElement.parentNode;
    }

    const movie_id = cardElement.dataset.id; //read ID from data attribute from HTML (added in renderResults). Example: 272 = `Batman Begins`
    const handler_params = {
      movie_id: movie_id,
      language: '',
    };
    const URL_handler = new TmdbUrlHandler('TMDB_movieData', handler_params);

    const AxiosMovieParams = {
      method: 'get',
      url: URL_handler.toString(),
    };

    try {
      const serverResponse = await axios(AxiosMovieParams);

      if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
        throw new ServerError(
          `Unable to get movie data from TMDB. Request: ${AxiosMovieParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`,
        );
      }

      //add movie data to modal window here
      //console.log(serverResponse.data); //debug line
      renderMovieDetails(serverResponse.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  // DEBUG MOVIE DETAILS
  // const testClickOnMovie = { preventDefault() { } }; //dummy Event
  // testClickOnMovie.target = { dataset: { id: 272 } }; //dummy Movie
  // showMovieDetails(testClickOnMovie);
  // END DEBUG MOVIE DETAILS

  // OPEN/CLOSE MODAL MOVIE
  async function openModalMovie(event) {
    scrollUpwardBtn.classList.remove('btn__scroll--show');
    await showMovieDetails(event);
    window.addEventListener('keydown', onEscKeyPress);
  }

  function closeModalMovie() {
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');

    const scrollParam = window.scrollY;
    const coords = document.documentElement.clientHeight;

    if (scrollParam > coords) {
      scrollUpwardBtn.classList.add('btn__scroll--show');
    }

    window.removeEventListener('keydown', onEscKeyPress);
  }
  function onEscKeyPress(e) {
    if (e.code === 'Escape') {
      closeModalMovie();
    }
  }
  function onBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeModalMovie();
    }
  }

  // OPEN/CLOSE MODAL TEAM
  refs.backdropTeam.addEventListener('click', onTeamBackdropClick);
  refs.openModalTeamBtn.addEventListener('click', openModalTeam);
  refs.closeModalTeamBtn.addEventListener('click', closeModalTeam);

  function onTeamEscKeyPress(e) {
    if (e.code === 'Escape') {
      closeModalTeam();
    }
  }
  function onTeamBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeModalTeam();
    }
  }
  function openModalTeam() {
    scrollUpwardBtn.classList.remove('btn__scroll--show');
    document.body.classList.toggle('modal-open');
    refs.modalTeam.classList.toggle('backdrop--is-hidden');
    window.addEventListener('keydown', onTeamEscKeyPress);
  }
  function closeModalTeam() {
    document.body.classList.toggle('modal-open');
    refs.modalTeam.classList.toggle('backdrop--is-hidden');

    const scrollParam = window.scrollY;
    const coords = document.documentElement.clientHeight;

    if (scrollParam > coords) {
      scrollUpwardBtn.classList.add('btn__scroll--show');
    }

    window.removeEventListener('keydown', onTeamEscKeyPress);
  }
})();
