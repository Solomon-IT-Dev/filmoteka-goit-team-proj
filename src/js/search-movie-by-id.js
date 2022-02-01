const axios = require('axios').default;
const { TmdbUrlHandler } = require('./api-service');

export async function getMovieDetails(movie_id, language) {
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