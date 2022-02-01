import refs from './refs'
import { getImagePathFromTMDB } from './get-image-full-path'
import { getMovieDetails } from './search-movie-by-id'
import { getLibraryFilms } from '../index.js';
import { spinner } from './spinner';
import modalMovieTemplate from '../templates/modal-movie-card.hbs';
const { TmdbUrlHandler } = require('./api-service');
import './dark-theme';
import Notiflix from 'notiflix';
import { SaveThemeModal } from './dark-theme'
import defaultImage from '../images/main-section/default-image.jpg';

const notiflixOverride = {
  fontFamily: "inherit",
  success: { background: "#ff6b01", },
};

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
      movieForRendering.poster_full_path = defaultImage;
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
      Notiflix.Notify.success(`Deleted ${movieForRendering.title} from watched`, notiflixOverride);
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
      Notiflix.Notify.success(`Added ${movieForRendering.title} to watched`, notiflixOverride);
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
      Notiflix.Notify.success(`Deleted ${movieForRendering.title} from queue`, notiflixOverride);
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
      Notiflix.Notify.success(`Added ${movieForRendering.title} to queue`, notiflixOverride);
    } 

    SaveThemeModal();
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
    refs.scrollUpwardBtn.classList.remove('btn__scroll--show');
    await showMovieDetails(event);
    window.addEventListener('keydown', onEscKeyPress);
  }

  function closeModalMovie() {
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');

    const scrollParam = window.scrollY;
    const coords = document.documentElement.clientHeight;

    if (scrollParam > coords) {
      refs.scrollUpwardBtn.classList.add('btn__scroll--show');
    }

    window.removeEventListener('keydown', onEscKeyPress);
    
    if (refs.buttonWatched.classList.contains('library-button-current') && refs.buttonMyLibrary.classList.contains('current')) { 
      getLibraryFilms( event, "watched");
    }
    if (refs.buttonQueue.classList.contains('library-button-current') && refs.buttonMyLibrary.classList.contains('current')) { 
     getLibraryFilms(event, "queue");
    }
  }
  function onEscKeyPress(event) {
    if (event.code === 'Escape') {
      closeModalMovie();
    }
  }
  function onBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModalMovie();
    }
  }

 
