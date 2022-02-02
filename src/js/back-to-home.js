import refs from './refs'
import { searchTrendMovies } from './search-trend-movies'

refs.buttonHome.addEventListener('click', backToHome);

function backToHome() {
  refs.emptyLibraryMessage.classList.add('visually-hidden');
  searchTrendMovies();
 };
