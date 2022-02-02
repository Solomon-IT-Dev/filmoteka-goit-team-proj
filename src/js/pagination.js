import TuiPagination from 'tui-pagination';
import "tui-pagination/dist/tui-pagination.css";
const axios = require('axios').default;
const { TmdbUrlHandler } = require('./api-service');
import { spinner } from './spinner';
import { renderResults } from './render-main-card-movie';
import { onBtnScrollUpwardClick } from './scroll';

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
export const tuiPaginationInstance = new TuiPagination(
  document.getElementById('tui-pagination-container'),
  tuiOptions,
);

tuiPaginationInstance.on('afterMove', event => {
  movePage(event);
});

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

    // document.querySelector('.error-message').classList.add('visually-hidden');

    if (serverResponse.statusText != 'OK' && serverResponse.status != 200) {
      throw new ServerError(
        `Unable to get new page from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. "TMDB RESPONSE STATUS: ${serverResponse.status}`,
      );
    }

    // if (serverResponse.data.results.length === 0) {
    //   document.querySelector('.error-message').classList.remove('visually-hidden');
    // }

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
