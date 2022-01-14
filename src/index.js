import './sass/main.scss';
const axios = require('axios').default;

/* CLass TMDB_handler is abstract. Instances of this class can't be created. However, any classes extending this one can (unless they are abstract, too) - and will inherit its fields and methods.
Essentially, it's a way to describe common methods for several classes in one place. */
class TMDB_GET_method {
    TMDB_API_ENTRY = "";
    TMDB_API_params = {};

    constructor() {
        if (this.constructor == TMDB_GET_method) {
            throw new Error("TMDB_GET_method class is abstract. Abstract classes can't be instantiated.");
        }
    };
    
    toString() {
        let asString = Object.keys(this.TMDB_API_params).reduce((urlPart, currentParam) => {
            //if currentParam is empty, skip it, otherwise concat
            if (this.TMDB_API_params[currentParam] === "") {
                return urlPart;
            }
            else {
                return urlPart + "&" + currentParam + "=" + this.TMDB_API_params[currentParam];
            };
        }, "");

        asString = this.TMDB_API_ENTRY + "?" + asString;

        return asString; //no api_key, remember to insert it!
    };
}

class TMDB_search extends TMDB_GET_method {
    TMDB_API_ENTRY = "search/movie";
    TMDB_API_params = {
        language : "", //example: en-US
        //sort_by = "original_title.asc",
        query : "",
        page : 1, //integer, max = 1000
        include_adult : "false", //force mature movies off
    };

    //private static method. Can only be called FROM the class (not instance) and BY the class/instance. Unreachable from the outside
    static #sanitizeString(dirtyString) {
        return dirtyString.trim().replaceAll(/ +/g, '+');
        //some RegExp magic. While it's a homemade one, it should trim spaces at the ends and replace inner spaces with a '+'
        //RegEx *should* do this: search one or more [space] (note the 'Kleene plus') and replace. 
    }
    
    constructor(queryString, page = 1) {
        super();
        this.TMDB_API_params.query = TMDB_search.#sanitizeString(queryString);
        this.TMDB_API_params.page = page;
    }
}


class TMDB_trending extends TMDB_GET_method {
    TMDB_API_ENTRY = "trending/";
    // media_type = all | movie | tv | person
    // time_window = day | week

    constructor(media_type = "movie", time_window = "week") {
        super();
        this.media_type = media_type;
        this.time_window = time_window;
    }

    toString() {
        return this.TMDB_API_ENTRY + this.media_type + "/" + this.time_window + "?";
        //example: "/trending/movie/week?"
    }
}

class TMDB_URL_handler {
    //some constants for API first
    TMDB_API = "https://api.themoviedb.org/3/";

    //injects api key into the query
    insertApiKey(queryString = "?") {
        //TMDB API KEY - V3 auth (move to environment vars later!)
        const api_key = "3f733d367aa88a68e8778536d460fad2";

        return queryString.replace('?', '?' + "api_key=" + api_key);
    }

    constructor(queryString = "", page = 1) {
        //if no search string is provided, init trending
        if (queryString === "") {
            this.handler = new TMDB_trending("movie", "week");
        }
        else {
            this.handler = new TMDB_search(queryString, page);
        }
    }

    toString() {
        if (this.handler.constructor.name === "TMDB_search") {
            //generate link for searching movies
            return this.TMDB_API + this.insertApiKey(this.handler.toString());
        }
        else {
            if (this.handler.constructor.name === "TMDB_trending") {
                //generate link for trending movies
                return this.TMDB_API + this.insertApiKey(this.handler.toString());
            }
        }
    }
};

//---TESTING---//

// const handler = new TMDB_URL_handler("", 1);
// console.log(handler);
// console.log(handler.toString())

async function searchMovies(event) {
    //event.preventDefault();

    // --- TESTING
    const search = prompt("What to search? (empty string for trending): ");

    console.log("Searching for: " + search);

    const URL_handler = new TMDB_URL_handler(search, 1);

    console.log("Generated query: " + URL_handler.toString());
    // --- end TESTING

    const AxiosSearchParams = {
        method: 'get',
        url: URL_handler.toString(),
        /* headers: {
        }, */
    };

    try {
        const searchResult = await axios(AxiosSearchParams);

        if (searchResult.statusText != "OK" && searchResult.status != 200) {
            throw new ServerError("TMDB response: " + searchResult.statusText + " " + "BAD TMDB RESPONSE STATUS: " + searchResult.status);
            //throw console.error("BAD PIXABAY RESPONSE STATUS: " + searchResult.status);
        }

        /*if (searchResult.status_code === 7 || searchResult.status_code === 34) {
            throw new ServerError("Error 401/404. TMDB API response: " + searchResult.status_message);
            //throw console.error("BAD PIXABAY RESPONSE STATUS: " + searchResult.status);
        }*/

        console.log(searchResult);
    }
    catch (error) {
        console.log(error.message);
    }
}

searchMovies();