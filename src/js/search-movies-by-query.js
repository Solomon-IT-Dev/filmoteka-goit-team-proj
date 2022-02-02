import refs from './refs';
const axios = require('axios').default;
import { tuiPaginationInstance} from './pagination'
import { spinner} from './spinner';
const { TmdbUrlHandler } = require('./api-service');
import { renderResults } from './render-main-card-movie'

refs.searchFormEl.addEventListener('submit', searchMovies);

export async function searchMovies(event = new Event('default')) {
  event.preventDefault();
  spinner.show();
  const searchString = event.currentTarget.elements.searchQuery.value.trim();
  let URL_handler = {};
  if (!searchString) {
    refs.errorMessageEl.classList.remove('visually-hidden');
    spinner.hide();
    return;
  }
  const handler_params = {
    queryString: searchString,
    page: 1,
    language: '',
  };
  URL_handler = new TmdbUrlHandler('TMDB_search', handler_params);

  const AxiosSearchParams = {
    method: 'get',
    url: URL_handler.toString(),
  };

  try {
    const serverResponse = await axios(AxiosSearchParams);
    refs.errorMessageEl.classList.add('visually-hidden');
    
    if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
      spinner.hide();
      throw new ServerError(
        `Unable to get search results from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`,
      );
    }

    tuiPaginationInstance.reset(serverResponse.data.total_results); //update total found movies

    tuiPaginationInstance.currentSearchString = searchString; ///important: we need to preserve searchString between func calls to make pagination possible. Here it's done via saving it into pagination object
    if (serverResponse.data.results.length === 0) {
      refs.errorMessageEl.classList.remove('visually-hidden');
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
