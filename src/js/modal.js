//import { renderMovieDetails } from "../index.js";
import { getImagePathFromTMDB, getMovieDetails, spinner, getLibraryFilms } from '../index.js';
const movieGalleryItem = document.querySelector('[data-id]');
import modalMovieTemplate from '../templates/modal-movie-card.hbs';
import mainMovieTemplate from '../templates/main-movie-card.hbs';
const { TmdbUrlHandler } = require('./api-service');
import { scrollUpwardBtn } from './scroll';
import './dark-theme';
import { SaveTheme } from './dark-theme'
import Notiflix from 'notiflix';

// Осуществление открытия модального окна
let movieForRendering;

const watchedArray = [];
const queueArray = [];

const savedDataWatched = localStorage.getItem('watched');
const parsedDataWatched = JSON.parse(savedDataWatched);
if (parsedDataWatched) {
  for (const array of parsedDataWatched) {
    watchedArray.push(array);
  } 
}

const savedDataQueue = localStorage.getItem('queue');
const parsedDataQueue = JSON.parse(savedDataQueue);
if (parsedDataQueue) {
  for (const array of parsedDataQueue) {
    queueArray.push(array);
  }
}

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
    
    //local-storage
    const buttonAddToWatched = document.querySelector('.modal-movies__button-watched');
    const buttonAddToQueue = document.querySelector('.modal-movies__button-queue');
    if (watchedArray.includes(movieForRendering.id)) {
      buttonAddToWatched.textContent = 'Delete from watched';
      buttonAddToWatched.addEventListener('click', deleteWatchedFilm);
    } else { 
      buttonAddToWatched.textContent = 'Add to watched';
      buttonAddToWatched.addEventListener('click', saveWatchedFilm);
    };

    if (queueArray.includes(movieForRendering.id)) {
      buttonAddToQueue.textContent = 'Delete from queue';
      buttonAddToQueue.addEventListener('click', deleteQueueFilm);
    } else { 
      buttonAddToQueue.textContent = 'Add to queue';
      buttonAddToQueue.addEventListener('click', saveFilmToQueue);
    }

    function deleteWatchedFilm(event) { 
      for (let i = 0; i < watchedArray.length; i++) {
        if (watchedArray[i] === movieForRendering.id) { 
          watchedArray.splice(i, 1);
        }
      }
      localStorage.setItem('watched', JSON.stringify(watchedArray));

      event.currentTarget.removeEventListener("click", deleteWatchedFilm);
      event.currentTarget.addEventListener('click', saveWatchedFilm);
      event.currentTarget.textContent = 'Add to watched';
      Notiflix.Notify.success(`Deleted ${movieForRendering.title} from watched`);
    }
  
    function saveWatchedFilm(event) {
      for (const filmID of watchedArray) {
        if (filmID === movieForRendering.id) {
          return;
        }
      }
      watchedArray.push(movieForRendering.id);
      localStorage.setItem('watched', JSON.stringify(watchedArray));
      
      event.currentTarget.removeEventListener("click", saveWatchedFilm);
      event.currentTarget.addEventListener('click', deleteWatchedFilm);
      event.currentTarget.textContent = 'Delete from watched';
      Notiflix.Notify.success(`Added ${movieForRendering.title} to watched`);
    }

    function deleteQueueFilm(event) { 
      for (let i = 0; i < queueArray.length; i++) {
        if (queueArray[i] === movieForRendering.id) { 
          queueArray.splice(i, 1);
        }
      }
      localStorage.setItem('queue', JSON.stringify(queueArray));

      event.currentTarget.removeEventListener("click", deleteQueueFilm);
      event.currentTarget.addEventListener('click', saveFilmToQueue);
      event.currentTarget.textContent = 'Add to queue';
      Notiflix.Notify.success(`Deleted ${movieForRendering.title} from queue`);
    }

    function saveFilmToQueue(event) {
      for (const filmID of queueArray) {
        if (filmID === movieForRendering.id) {
          return;
        }
      }
      queueArray.push(movieForRendering.id);
      localStorage.setItem('queue', JSON.stringify(queueArray));

      event.currentTarget.removeEventListener("click", saveFilmToQueue);
      event.currentTarget.addEventListener('click', deleteQueueFilm);
      event.currentTarget.textContent = 'Delete from queue';
      Notiflix.Notify.success(`Added ${movieForRendering.title} to queue`);
    } 

    SaveTheme();
  }

  

  async function showMovieDetails(event = new Event('default')) {
    event.preventDefault();


    if (event.target.nodeName === 'UL') {
      return;
    }
    
    let cardElement = event.target;
    while (cardElement.nodeName != 'LI') {
      cardElement = cardElement.parentNode;
    }

    spinner.show();

    const movie_id = cardElement.dataset.id; //read ID from data attribute from HTML (added in renderResults). Example: 272 = `Batman Begins`
    
    const movieData = await getMovieDetails(movie_id, "");

    //add movie data to modal window here
    
    renderMovieDetails(movieData);
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');
    spinner.hide();
  }

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
    
    if (document.querySelector('.library-button__watched').classList.contains('library-button-current') && document.querySelector('.button-mylibrary').classList.contains('current')) { 
      getLibraryFilms( event, "watched");
    }
    if (document.querySelector('.library-button__queue').classList.contains('library-button-current') && document.querySelector('.button-mylibrary').classList.contains('current')) { 
     getLibraryFilms(event, "queue");
    }
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


