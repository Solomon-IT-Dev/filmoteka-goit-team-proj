//IMPORTS
import './js/header-switcher';
import './js/scroll';
import './js/modal';
import './js/dark-theme';
import mainMovieTemplate from './templates/main-movie-card.hbs';
import './js/modal-movie';

    
const axios = require('axios').default;
import {SaveTheme} from './js/dark-theme'
import TuiPagination from 'tui-pagination';
import "tui-pagination/dist/tui-pagination.css";

import { onBtnScrollUpwardClick } from './js/scroll';

import 'tui-pagination/dist/tui-pagination.css';
import Spinner from './js/spinner';
import './sass/main.scss';
//module for generating correct API queries for TheMovieDatabase
const { TmdbUrlHandler } = require('./js/api-service');

//CODE

const spinner = new Spinner({
  hidden: true,
});

const movieGalleryElement = document.querySelector('.films-list');
const searchFormEl = document.querySelector('.search-form');
const buttonHome = document.querySelector('.button-home');
const buttonMyLibrary = document.querySelector('.button-mylibrary');


searchFormEl.addEventListener('submit', searchMovies);
document.addEventListener('DOMContentLoaded', searchTrendMovies); //upload 1 page of trends on first load of the page
buttonHome.addEventListener('click', backToHome);
buttonMyLibrary.addEventListener('click', myLibraryPage);

const tuiOptions = {
  totalItems: 0, //set proper value in search
  itemsPerPage: 20, //default from TMDB API
  visiblePages: 4,
  page: 1,
  centerAlign: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
  usageStatistics: true, //GoogleStats for usage of TuiP
};
const tuiPaginationInstance = new TuiPagination(
  document.getElementById('tui-pagination-container'),
  tuiOptions,
);

let TMDB_GENRE_CACHE; //undefined. Clean it when we change language!

let TMDB_CONFIG; //undefined

/* Generates full path for images from IMDB.
file_path: short path from 'movieData' or a search result
size: any size that IMDB supports. Optional. See IMDB_CONFIG for valid sizes. Default is "original" */

async function getImagePathFromTMDB(file_path, size) {
  //do ONCE - cache IMDB config with base_path and sizes for images
  //reference for config format: https://developers.themoviedb.org/3/configuration/get-api-configuration
  if (TMDB_CONFIG === undefined) {
    try {
      const AxiosConfigParams = {
        method: 'get',
        url: new TmdbUrlHandler('TMDB_config').toString(),
      };

      const serverResponse = await axios(AxiosConfigParams);

      if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
        throw new ServerError(
          `Unable to cache configuration from TMDB. Request: ${AxiosConfigParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`,
        );
      }

      TMDB_CONFIG = serverResponse.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  const handler_params = {
    TMDB_base_url: TMDB_CONFIG.images.secure_base_url,
    size: size,
    file_path: file_path,
  };
  const URL_handler = new TmdbUrlHandler('TMDB_image', handler_params);

  return URL_handler.toString();
}


async function makeMoviesDataforRendering(TMDB_response_results) {
    const moviesListForRendering = [];
    for (const movie of TMDB_response_results) {
        let movieForRendering = {};
        if (movie.title) {
            movieForRendering = await addGenreNames(movie);
            if (movieForRendering.genres.length !== 0) {
                movieForRendering.short_genres = movieForRendering.genres.slice(0, 3).sort().join(", ");
            } else {
                movieForRendering.short_genres = "Genre unknown";
            }
            if (movie.poster_path) {
                const movieFullAdress = await getImagePathFromTMDB(movie.poster_path, "w780");
                movieForRendering.poster_full_path = movieFullAdress;
            } else { 
                movieForRendering.poster_full_path = "https://www.southwest-windows.co.uk/wp-content/uploads/sites/68/2013/11/dummy-image-portrait.jpg"
            }
            if (movie.release_date) {
                movieForRendering.release_year = movie.release_date.slice(0, 4);
            }
            moviesListForRendering.push(movieForRendering);
        }
    }
    return moviesListForRendering;
}
async function renderResults(TMDB_response_results) {
  /* Accepts serverResponse.data.results from Axios 
    see https://developers.themoviedb.org/3/search/search-movies for reference */
  /* single movie Object format from TMDB:
    (some fields are optional and may not be present!)
    {
        adult: false​​​
        backdrop_path: "/tXe3XBDkdCiNfSdyI7zZ0fz8lAC.jpg"     ​​​
        genre_ids: Array(3) [ 28, 80, 18 ] ​​​
        id: 414906
        original_language: "en" ​​​
        original_title: "The Batman"
        overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler."   ​​​
        popularity: 90.516​​​
        poster_path: "/pOaKyhMwALpCTg07eQQu0SQCbL9.jpg"
        release_date: "2022-03-01"
        title: "The Batman"​​​
        video: false​​​
        vote_average: 0​​​
        vote_count: 0
    }
	*/
    movieGalleryElement.innerHTML = '';

    const moviesListForRendering = await makeMoviesDataforRendering(TMDB_response_results);
    const markup = mainMovieTemplate(moviesListForRendering);
    movieGalleryElement.insertAdjacentHTML("beforeend", markup);
    SaveTheme();
}

/* Adds field "genres" with an array of genres in text into a single movie object (and removes "genre_ids").
'movieData' should have a proper 'genre_ids[]' field!
If you have an array of movies, run it for EACH of them. 
Pure function: returns a modified COPY of movieData */

async function addGenreNames(movieData, language) {
  //do ONCE - cache genres from the backend
  if (TMDB_GENRE_CACHE === undefined) {
    try {
      const AxiosGenreParams = {
        method: 'get',
        url: new TmdbUrlHandler('TMDB_genres', { language: language }).toString(),
      };

      const serverResponse = await axios(AxiosGenreParams);

      if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
        throw new ServerError(
          `Unable to cache genres from TMDB. Request: ${AxiosGenreParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`,
        );
      }

      TMDB_GENRE_CACHE = serverResponse.data.genres;
    } catch (error) {
      console.log(error.message);
    }
  }

  const movieData_with_genres = { ...movieData }; //clone movie object BY VALUE!

  if (movieData_with_genres.genre_ids) {
    //we have short movie data without genres from search
    delete movieData_with_genres.genre_ids;

    movieData_with_genres.genres = movieData.genre_ids.map(genre_id => {
      const genreObject = TMDB_GENRE_CACHE.find(genre => {
        return genre.id === genre_id;
      });
      return genreObject.name;
    });
  }
  else if (movieData_with_genres.genres && movieData_with_genres.genres.every( (genre) => genre.name ) ) {
    //we have full movie data from Library, objects have names
    movieData_with_genres.genres = movieData.genres.map(genre => {
      return genre.name;
    });
  } 

  return movieData_with_genres;
}

async function searchMovies(event = new Event('default')) {
  event.preventDefault();

  spinner.show();

  const searchString = event.currentTarget.elements.searchQuery.value.trim();
  //console.log(searchString);
  // --- DEBUG TESTING - split trends into separate function?
  let URL_handler = {};
  if (!searchString) {
    document.querySelector('.error-message').classList.remove('visually-hidden');
    spinner.hide();
    return;
  }
  const handler_params = {
    queryString: searchString,
    page: 1,
    language: '',
  };
  URL_handler = new TmdbUrlHandler('TMDB_search', handler_params);

  //console.log("Generated query: " + URL_handler.toString());
  // --- END TESTING

  const AxiosSearchParams = {
    method: 'get',
    url: URL_handler.toString(),
  };

  try {
    const serverResponse = await axios(AxiosSearchParams);
    document.querySelector('.error-message').classList.add('visually-hidden');
    
    if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
      spinner.hide();
      throw new ServerError(
        `Unable to get search results from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`,
      );
    }

    tuiPaginationInstance.reset(serverResponse.data.total_results); //update total found movies

    tuiPaginationInstance.currentSearchString = searchString; ///important: we need to preserve searchString between func calls to make pagination possible. Here it's done via saving it into pagination object
    if (serverResponse.data.results.length === 0) {
      document.querySelector('.error-message').classList.remove('visually-hidden');
      spinner.hide();
    }
    if (serverResponse.data.results.length > 0) {
      //If we have non-zero matches, render them
      renderResults(serverResponse.data.results);
      //console.log(serverResponse.data.results); //debug line
    }
  } catch (error) {
    console.log(error.message);
  }
  spinner.hide();
}

async function searchTrendMovies() {
  let URL_handler = {};
  const handler_params = {
    page: 1,
  };
  URL_handler = new TmdbUrlHandler('TMDB_trending', { page: 1 });

  const AxiosSearchParams = {
    method: 'get',
    url: URL_handler.toString(),
  };

  spinner.show();

  try {
    const serverResponse = await axios(AxiosSearchParams);

    if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
      spinner.hide();
      throw new ServerError(
        `Unable to get search results from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`,
      );
    }

    tuiPaginationInstance.reset(serverResponse.data.total_results); //update total found movies

    tuiPaginationInstance.currentSearchString = ''; ///important: we need to preserve searchString between func calls to make pagination possible. Here it's done via saving it into pagination object

    if (serverResponse.data.results.length > 0) {
      //If we have non-zero matches, render them
      renderResults(serverResponse.data.results);
      onBtnScrollUpwardClick();
      //console.log(serverResponse.data.results); //debug line
    }
  } catch (error) {
    console.log(error.message);
  }
  spinner.hide();
}

/* Requests another page for the same search string. Calls render afterwars.
Needs a wrapper telling it what page to load (direction)*/

tuiPaginationInstance.on('afterMove', event => {
  movePage(event);
});

/* function for pagination
Works for both trends and search results.
Is called by tuiPaginationInstance. Should not be called separately.
event is generated by tuiPaginationInstance and is required for determining correct page */
async function movePage(event) {
  //direction) {
  let URL_handler;

  if (!tuiPaginationInstance.currentSearchString) {
    const handler_params = {
      page: event.page,
    };
    URL_handler = new TmdbUrlHandler('TMDB_trending', handler_params);
  } else {
    const handler_params = {
      queryString: tuiPaginationInstance.currentSearchString,
      page: event.page,
      language: '',
    };
    URL_handler = new TmdbUrlHandler('TMDB_search', handler_params);
  }
  //console.log('Generated query: ' + URL_handler.toString());

  const AxiosSearchParams = {
    method: 'get',
    url: URL_handler.toString(),
  };

  try {
    spinner.show();

    const serverResponse = await axios(AxiosSearchParams);

    document.querySelector('.error-message').classList.add('visually-hidden');

    if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
      throw new ServerError(
        `Unable to get new page from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. "TMDB RESPONSE STATUS: ${serverResponse.status}`,
      );
    }

    if (serverResponse.data.results.length === 0) {
      document.querySelector('.error-message').classList.remove('visually-hidden');
    }

    if (serverResponse.data.results.length > 0) {
      //TODO: additionally disable interface elements responsible for switching here accordingly

      renderResults(serverResponse.data.results);
      onBtnScrollUpwardClick();
      //console.log(serverResponse.data); //debug line
    }
  } catch (error) {
    console.log(error.message);
  }

  spinner.hide();
}


//local-storage

const buttonWached = document.querySelector('.library-button__watched');
// buttonWached.addEventListener('click', renderWachedFilms);
buttonWached.addEventListener('click', (event) => getLibraryFilms(event, "watched"));

const buttonQueue = document.querySelector('.library-button__queue');
// buttonQueue.addEventListener('click', (renderQueueFilms);
buttonQueue.addEventListener('click', (event) => getLibraryFilms(event, "queue"));


/* get single movieData object from IMDB */

async function getMovieDetails(movie_id, language) {
    const handler_params = {
      movie_id: movie_id,
      language: language,
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
      //console.log(serverResponse.data); //debug line
      return serverResponse.data; //return detailed movie data
    } catch (error) {
      console.log(error.message);
    }
    return false; //otherwise return false
}

/* function retrieves movie data from IMDB based on ids in localStorage and calls render

libraryPage: 'watched' (default) | 'queue' */

async function getLibraryFilms(event = new Event("default"), libraryPage = 'watched') {
  const savedData = localStorage.getItem(libraryPage.toLowerCase());
  const parsedData = JSON.parse(savedData); //IDs of movies

  movieGalleryElement.innerHTML = '';

  if (!parsedData) {
    const showEmptyGalleryMessage = !parsedData;
    document.querySelector('.empty-library').classList.toggle('visually-hidden', !showEmptyGalleryMessage); //hide gallery if there are no movies in localStorage
    return; //no movies in localStorage, early exit
  }
  
  spinner.show();

  try {
    const arrayOfMovies = await Promise.all( parsedData.map(async (id) => getMovieDetails(id, "") ) );

    renderResults(arrayOfMovies);
  }
  catch (error) {
    console.log(error.message);
  }

  spinner.hide();
}

function myLibraryPage(event) {
  movieGalleryElement.innerHTML = '';

  // renderWachedFilms();
  getLibraryFilms(event, "watched");
};

function backToHome() {
  document.querySelector('.empty-library').classList.add('visually-hidden');
  searchTrendMovies();
 };

//export common functions

exports.getImagePathFromTMDB = getImagePathFromTMDB;
exports.getMovieDetails = getMovieDetails;
exports.spinner = spinner;