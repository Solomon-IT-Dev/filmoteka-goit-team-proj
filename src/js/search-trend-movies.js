const axios = require('axios').default;
import { tuiPaginationInstance } from '../index'
import { spinner } from './spinner';
const { TmdbUrlHandler } = require('./api-service');
import { renderResults } from './render-main-card-movie'
import { onBtnScrollUpwardClick } from './scroll'

document.addEventListener('DOMContentLoaded', searchTrendMovies); //upload 1 page of trends on first load of the page
export async function searchTrendMovies() {
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