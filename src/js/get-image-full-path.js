const axios = require('axios').default;
const { TmdbUrlHandler } = require('./api-service');

let TMDB_CONFIG; //undefined

/* Generates full path for images from IMDB.
file_path: short path from 'movieData' or a search result
size: any size that IMDB supports. Optional. See IMDB_CONFIG for valid sizes. Default is "original" */

export async function getImagePathFromTMDB(file_path, size) {
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

