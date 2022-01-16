import './sass/main.scss';

import './js/modal';
const axios = require('axios').default;

//module for generating correct API queries for TheMovieDatabase
const { TMDB_URL_handler } = require("./js/api-service");

const { Pagination } = require("./js/pagination");

const pageCounter = new Pagination();
let TMDB_GENRE_CACHE; //undefined. Clean it when we change language!

async function renderResults(TMDB_response_results) {
    /* Accepts serverResponse.data.resuts from Axios */
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
	} */
    
    const markup = TMDB_response_results.reduce((currentMarkup, currentMovie) => {
        const currentImageMarkup = ``; //TODO: single movie card markup here
        
        return currentMarkup += currentImageMarkup;
    }, "");

    //console.log(TMDB_response_results); //debug line

    //movieGalleryElement.insertAdjacentHTML("beforeend", markup);
    //imageLightBox.refresh(); //force update SimpleLightbox
}

/* This function adds field "genres" with an array of genres in text into a single movie object (and removes "genre_ids").
'movieData' should have a proper 'genre_ids[]' field!
If you have an array of movies, run it for EACH of them 
Pure function: returns a modified COPY of movieData */
async function addGenreNames(movieData, language = "") {
    //do ONCE - cache genres from the backend
    try {
        if (TMDB_GENRE_CACHE === undefined) {
            const AxiosGenreParams = {
                method: 'get',
                url: new TMDB_URL_handler("TMDB_genres", { language: language }).toString(),
            };

            const serverResponse = await axios(AxiosGenreParams);

            if (serverResponse.statusText != "OK" && searchResult.status != 200) {
                throw new ServerError(`Unable to cache genres from TMDB. Request: ${AxiosGenreParams.url}. TMDB response: ${serverResponse.statusText}. BAD TMDB RESPONSE STATUS: ${serverResponse.status}`);
            }

            TMDB_GENRE_CACHE = serverResponse.data.genres;
        }


    }
    catch (error) {
        console.log(error.message);
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

async function searchMovies(event) {
    //event.preventDefault();

    let searchString;

    // --- DEBUG TESTING
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
            throw new ServerError(`Unable to cache genres from TMDB. Request: ${AxiosGenreParams.url}. TMDB response: ${serverResponse.statusText}. BAD TMDB RESPONSE STATUS: ${serverResponse.status}`);
        }

        pageCounter.resetNewPage(searchString, serverResponse.data.total_results, serverResponse.data.total_pages);

        if (serverResponse.data.results.length > 0) {
            //If we have non-zero matches, render them
            renderResults(serverResponse.data.results);
            console.log(serverResponse.data); //debug line
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

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

        if (serverResponse.statusText != "OK" && searchResult.status != 200) {
            throw new ServerError("TMDB response: " + serverResponse.statusText + " " + "BAD TMDB RESPONSE STATUS: " + serverResponse.status);
        }    

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