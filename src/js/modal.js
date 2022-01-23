//import { renderMovieDetails } from "../index.js";
import { getImagePathFromTMDB } from "../index.js";
const movieGalleryItem = document.querySelector('[data-id]');
import modalMovieTemplate from '../templates/modal-movie-card.hbs';
const { TmdbUrlHandler } = require("./api-service");
const axios = require('axios').default;
// Осуществление открытия модального окна


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
  };
 

  refs.backdrop.addEventListener('click', onBackdropClick);
  refs.openModalMovieBtn.addEventListener('click', openModalMovie);
  refs.closeModalMovieBtn.addEventListener('click', closeModalMovie);

  // function getId(e) {
  //   return e.path.find(num => num.className === 'films-list__link').dataset.id;  
  // }

  async function renderMovieDetails(movieData) {
    /* Accepts serverResponse.data.results from Axios 
      see https://developers.themoviedb.org/3/movies/get-movie-details for reference */
    // const ArrayOfOneMovieObject = [];
    // ArrayOfOneMovieObject.push(movieData);
    // const oneMovieDataForRendering = await makeMoviesDataforRendering(ArrayOfOneMovieObject);
    //TODO: add markup to event.target based on what movieData has, open modal window
    
    let movieForRendering = {...movieData};
    
      if (movieData.poster_path) {
          const movieFullAdress = await getImagePathFromTMDB(movieData.poster_path, "w780");
          movieForRendering.poster_full_path = movieFullAdress;
      } else { 
          movieForRendering.poster_full_path = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
      }
      if (movieData.release_date) {
          movieForRendering.release_year = movieData.release_date.slice(0, 4);
      }
    
    console.log(movieForRendering);
    const genresForRender = movieForRendering.genres.slice(0, 3).map( (genre) => genre.name ).sort().join(", ");
    movieForRendering.short_genres = genresForRender;
      
      refs.modalMovieContainer.innerHTML = '';
    const markup = modalMovieTemplate(movieForRendering);
      // const movieCardForRendering = await showMovieDetails()
      refs.modalMovieContainer.insertAdjacentHTML("beforeend", markup);
      
      //get full image paths in sizes with: await getImagePathFromIMDB()
      // console.log(markup)
  }


  async function showMovieDetails(event = new Event('default')) {
    event.preventDefault();
    
    if (event.target.nodeName === "UL") {
      return;
    }
    let cardElement = event.target;
    while (cardElement.nodeName != "LI") {
      cardElement = cardElement.parentNode;
    }

    const movie_id = cardElement.dataset.id; //read ID from data attribute from HTML (added in renderResults). Example: 272 = `Batman Begins`
    const handler_params = {
        movie_id: movie_id,
        language : "",
    };
    const URL_handler = new TmdbUrlHandler("TMDB_movieData", handler_params);

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
    renderMovieDetails( serverResponse.data);
    
  } catch (error) {
    console.log(error.message);
  }
}

// DEBUG MOVIE DETAILS
// const testClickOnMovie = { preventDefault() { } }; //dummy Event
// testClickOnMovie.target = { dataset: { id: 272 } }; //dummy Movie
// showMovieDetails(testClickOnMovie);
// END DEBUG MOVIE DETAILS
  
  async function openModalMovie(event) {
    //renderMovieDetails(getId(event))
    
    await showMovieDetails(event);
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');
      window.addEventListener('keydown', onEscKeyPress);

  }

  function closeModalMovie() {
    document.body.classList.toggle('modal-open');
    refs.modalMovie.classList.toggle('backdrop--is-hidden');
    
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
  refs.openModalTeamBtn.addEventListener('click', toggleModalTeam);
  refs.closeModalTeamBtn.addEventListener('click', toggleModalTeam);

  function toggleModalTeam() {
    document.body.classList.toggle('modal-open');
    refs.modalTeam.classList.toggle('backdrop--is-hidden');
  }
})();
