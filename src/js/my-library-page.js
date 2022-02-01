import refs from './refs'
import { spinner } from './spinner'
import { getMovieDetails } from './search-movie-by-id';
import { renderResults } from './render-main-card-movie'

refs.buttonMyLibrary.addEventListener('click', myLibraryPage);

refs.buttonWatched.addEventListener('click', (event) => {
  getLibraryFilms(event, "watched");
  refs.buttonQueue.classList.remove('library-button-current');
  refs.buttonWatched.classList.add('library-button-current');
});


refs.buttonQueue.addEventListener('click', (event) => {
  getLibraryFilms(event, "queue");
  refs.buttonWatched.classList.remove('library-button-current');
  refs.buttonQueue.classList.add('library-button-current');
});

export async function getLibraryFilms(event = new Event("default"), libraryPage = 'watched') {
  const savedData = localStorage.getItem(libraryPage.toLowerCase());
  const parsedData = JSON.parse(savedData); //IDs of movies

  refs.movieGalleryElement.innerHTML = '';

  const isGalleryEmpty = (!parsedData) || (parsedData.length === 0 ); //if localStorage is empty or contains an empty array
  refs.emptyLibraryMessage.classList.toggle('visually-hidden', !isGalleryEmpty); //hide gallery if there are no movies in localStorage

  if (isGalleryEmpty) {
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
  refs.movieGalleryElement.innerHTML = '';
  getLibraryFilms(event, "watched");
  refs.buttonQueue.classList.remove('library-button-current');
  refs.buttonWatched.classList.add('library-button-current');
};