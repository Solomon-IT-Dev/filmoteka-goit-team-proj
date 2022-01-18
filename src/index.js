import './sass/main.scss';
import './js/header-switcher';
import './js/modal';
const axios = require('axios').default;

//module for generating correct API queries for TheMovieDatabase
const { TMDB_URL_handler } = require("./js/api-service");

const { Pagination } = require("./js/pagination");

const pageCounter = new Pagination();
let TMDB_GENRE_CACHE; //undefined. Clean it when we change language!

let TMDB_CONFIG; //undefined

/* Returns full path for images from IMDB.
file_path: short path from 'movieData' or a search result
size: any size that IMDB supports. Optional. See IMDB_CONFIG for valid sizes. Default is "original" */

async function getImagePathFromTMDB(file_path, size) {
    //do ONCE - cache IMDB config with base_path and sizes for images
    //reference for config format: https://developers.themoviedb.org/3/configuration/get-api-configuration 
    if (TMDB_CONFIG === undefined) {
        try {
            const AxiosConfigParams = {
                method: 'get',
                url: new TMDB_URL_handler("TMDB_config").toString(),
            };

            const serverResponse = await axios(AxiosConfigParams);

            if (serverResponse.statusText != "OK" && searchResult.status != 200) {
                throw new ServerError(`Unable to cache Getsconfiguration from TMDB. Request: ${AxiosConfigParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`);
            }

            TMDB_CONFIG = serverResponse.data;
            //console.log(TMDB_CONFIG); //debug line
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const handler_params = {
        TMDB_base_url: TMDB_CONFIG.images.secure_base_url,
        size: size,
        file_path: file_path,
    };
    const URL_handler = new TMDB_URL_handler("TMDB_image", handler_params);

    return URL_handler.toString();
}

//DEBUG IMAGE - gets backdrop image path for 'Batman Begins', width=780
// console.log( getImagePathFromTMDB("/y9AuabF1SXnn3xZ0tAJLLhv33Uj.jpg", "w780") );
//END DEBUG IMAGE

async function renderMovieDetails(event, movieData) {
    /* Accepts serverResponse.data.results from Axios 
    see https://developers.themoviedb.org/3/movies/get-movie-details for reference */

    //TODO: add markup to event.target based on what movieData has, open modal window

    //get full image paths in sizes with getImagePathFromIMDB()
}

async function showMovieDetails(event = new Event("default")) {
    event.preventDefault();

    const movie_id = event.target.dataset.id; //read ID from data attribute from HTML (added in renderResults). Example: 272 = `Batman Begins`
    const handler_params = {
        movie_id: movie_id,
        language : "",
    };
    const URL_handler = new TMDB_URL_handler("TMDB_movieData", handler_params);

    console.log("Generated query: " + URL_handler.toString()); //debug line

    const AxiosMovieParams = {
        method: 'get',
        url: URL_handler.toString(),
    };

    try {
        const serverResponse = await axios(AxiosMovieParams);

        if (serverResponse.statusText != "OK" && searchResult.status != 200) {
            throw new ServerError(`Unable to get movie data from TMDB. Request: ${AxiosMovieParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`);
        }

        //add movie data to modal window here
        renderMovieDetails(event, serverResponse.data);
        //console.log(serverResponse.data); //debug line
    }
    catch (error) {
        console.log(error.message);
    }
}

// DEBUG MOVIE DETAILS
// const testClickOnMovie = { preventDefault() { } }; //dummy Event
// testClickOnMovie.target = { dataset: { id: 272 } }; //dummy Movie
// showMovieDetails(testClickOnMovie);
// END DEBUG MOVIE DETAILS

async function renderResults(TMDB_response_results) {
    /* Accepts serverResponse.data.results from Axios 
    see https://developers.themoviedb.org/3/search/search-movies for reference */
    /* single movie Object format from TMDB:
    (some fields are optional and may not be present!)
    {
        adult: false​​​
        backdrop_path: "/tXe3XBDkdCiNfSdyI7zZ0fz8lAC.jpg"     ​​​
        genre_ids: Array(3) [ 28, 80, 18 ] ​​​
        id: 414906
        original_language: "en" ​​​
        original_title: "The Batman"
        overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler."   ​​​
        popularity: 90.516​​​
        poster_path: "/pOaKyhMwALpCTg07eQQu0SQCbL9.jpg"
        release_date: "2022-03-01"
        title: "The Batman"​​​
        video: false​​​
        vote_average: 0​​​
        vote_count: 0
    }
	*/
    
    const markup = TMDB_response_results.reduce((currentMarkup, currentMovie) => {
        const currentMovieWithGenres = addGenreNames(currentMovie);
        const currentImageMarkup = ``; //TODO: single movie card markup here

        //Add ID from each movie as a data attribute to the external element (the one which opens a modal window). Format: data-id="{TMDB id}"
        
        return currentMarkup += currentImageMarkup;
    }, "");

    //console.log(TMDB_response_results); //debug line

    //movieGalleryElement.insertAdjacentHTML("beforeend", markup);
    //imageLightBox.refresh(); //force update SimpleLightbox
}

/* Adds field "genres" with an array of genres in text into a single movie object (and removes "genre_ids").
'movieData' should have a proper 'genre_ids[]' field!
If you have an array of movies, run it for EACH of them. 
Pure function: returns a modified COPY of movieData */

async function addGenreNames(movieData, language) {
    //do ONCE - cache genres from the backend
    if (TMDB_GENRE_CACHE === undefined) {
        try {
            const AxiosGenreParams = {
                method: 'get',
                url: new TMDB_URL_handler("TMDB_genres", { language: language }).toString(),
            };

            const serverResponse = await axios(AxiosGenreParams);

            if (serverResponse.statusText != "OK" && searchResult.status != 200) {
                throw new ServerError(`Unable to cache genres from TMDB. Request: ${AxiosGenreParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`);
            }

            TMDB_GENRE_CACHE = serverResponse.data.genres;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    //console.log(TMDB_GENRE_CACHE); //DEBUG line

    const movieData_with_genres = {...movieData}; //clone movie object BY VALUE!
    delete movieData_with_genres.genre_ids;
    
    movieData_with_genres.genres = movieData.genre_ids.map((genre_id) => {
        const genreObject = TMDB_GENRE_CACHE.find((genre) => {
            return genre.id === genre_id;
        });
        return genreObject.name;
    });

    return movieData_with_genres;
}

async function searchMovies(event = new Event("default")) {
    event.preventDefault();

    let searchString;

    // --- DEBUG TESTING - replace with actual search
    searchString = prompt("What to search? (empty string for trending): ");
    console.log("Searching for: " + searchString);
    let URL_handler = {};
    if (searchString === "") {
        URL_handler = new TMDB_URL_handler("TMDB_trending");
    }
    else {
        const handler_params = {
            queryString: searchString,
            page: 1,
            language: "",
        }
        URL_handler = new TMDB_URL_handler("TMDB_search", handler_params);
    }
    console.log("Generated query: " + URL_handler.toString());
    // --- END TESTING

    const AxiosSearchParams = {
        method: 'get',
        url: URL_handler.toString(),
    };

    try {
        const serverResponse = await axios(AxiosSearchParams);

        if (serverResponse.statusText != "OK" && searchResult.status != 200) {
            throw new ServerError(`Unable to cache genres from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. TMDB RESPONSE STATUS: ${serverResponse.status}`);
        }

        pageCounter.resetNewPage(searchString, serverResponse.data.total_results, serverResponse.data.total_pages);

        if (serverResponse.data.results.length > 0) {
            //If we have non-zero matches, render them
            renderResults(serverResponse.data.results);
            //console.log(serverResponse.data); //debug line
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

/* Requests another page for the same search string. Calls render afterwars.
Needs a wrapper telling it what page to load (direction)*/

async function movePage(direction) {
    //valid values for direction: next | prev | first | last
    if (pageCounter.movePage(direction) === false) {
        console.log(pageCounter.movePage(direction));
        return false; //try to move page, early exit if it fails
    };

    const URL_handler = new TMDB_URL_handler(pageCounter.currentSearchString, pageCounter.currentPage);

    const AxiosSearchParams = {
        method: 'get',
        url: URL_handler.toString(),
    };

    try {
        const serverResponse = await axios(AxiosSearchParams);
document.querySelector('.error-message').classList.add('visually-hidden');
        if (serverResponse.statusText != "OK" && searchResult.status != 200) {
            throw new ServerError(`Unable to get new page from TMDB. Request: ${AxiosSearchParams.url}. TMDB response: ${serverResponse.statusText}. "TMDB RESPONSE STATUS: ${serverResponse.status}`);
        }    
if (serverResponse.data.results.length === 0){document.querySelector('.error-message').classList.remove('visually-hidden');}
        if (serverResponse.data.results.length > 0) {
            //TODO: additionally disable interface elements responsible for switching here accordingly

            renderResults(serverResponse.data.results);
            //console.log(serverResponse.data); //debug line
        }   
    }
    catch (error) {
        console.log(error.message);
    }
}