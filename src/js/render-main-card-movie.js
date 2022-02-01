import refs from './refs';
import { SaveTheme } from './dark-theme';
import { addGenreNames } from '../index';
import { getImagePathFromTMDB } from '../index'
import mainMovieTemplate from '../templates/main-movie-card.hbs';
import defaultImage from '../images/main-section/default-image.jpg';

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
              movieForRendering.poster_full_path = defaultImage;
            }
            if (movie.release_date) {
                movieForRendering.release_year = movie.release_date.slice(0, 4);
            }
            moviesListForRendering.push(movieForRendering);
        }
    }
    return moviesListForRendering;
}

export async function renderResults(TMDB_response_results) {
    refs.movieGalleryElement.innerHTML = '';
    const moviesListForRendering = await makeMoviesDataforRendering(TMDB_response_results);
    const markup = mainMovieTemplate(moviesListForRendering);
    refs.movieGalleryElement.insertAdjacentHTML("beforeend", markup);
    SaveTheme();
}
