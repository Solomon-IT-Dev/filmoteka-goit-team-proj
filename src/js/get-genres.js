const axios = require('axios').default;
const { TmdbUrlHandler } = require('./api-service');

let TMDB_GENRE_CACHE; //undefined. Clean it when we change language!

export async function addGenreNames(movieData, language) {
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
