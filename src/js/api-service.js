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
/* This handler generates queries for names of genres based on their IDs from IMDB */
class TMDB_genres extends TMDB_GET_method {
    TMDB_API_ENTRY = "genre/movie/list";

    constructor(language = "") {
        super();
        this.TMDB_API_params.language = language;
    }

    //toString() example: https://api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US
}

class TMDB_movieData extends TMDB_GET_method {
    TMDB_API_ENTRY = "movie/";
    movie_id; //required
    TMDB_API_params = {
        language: "", //example: en-US
    }

    constructor(movie_id, language = "") {
        super();
        this.movie_id = movie_id;
        this.TMDB_API_params.language = language;
    }

    toString() {
        //example: https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
        const URL_with_params = super.toString.call(this);
        return URL_with_params.replace('?', this.movie_id + '?');
    }
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
    
    constructor(queryString, page = 1, language = "") {
        super();
        this.TMDB_API_params.query = TMDB_search.#sanitizeString(queryString);
        this.TMDB_API_params.page = page;
        this.TMDB_API_params.language = language;
    }
}

class TMDB_trending extends TMDB_GET_method {
    TMDB_API_ENTRY = "trending/";
    media_type; // all | movie | tv | person
    time_window; // day | week

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

/* This class is a wrapper.
Only this class is exported and used externally in other modules. An API of sorts? Start your work with studying it.

Its first (and only) function is to generate correct URLs for TheMovieDatabase API (which you can later use in Axios). */

class TMDB_URL_handler {
    //Backend host address
    TMDB_API = "https://api.themoviedb.org/3/";

    //injects api key into the query
    insertApiKey(queryString = "?") {
        //TMDB API KEY - V3 auth (move to environment vars later?)
        //search yield: moving a key to env var doesn't protect it much (it is still exposed during network request) but it's probably slightly better than keeping it in source code in plain text
        const api_key = "3f733d367aa88a68e8778536d460fad2";

        return queryString.replace('?', '?' + "api_key=" + api_key);
    }

    constructor(handler, handler_parameters = {}) {
        //each "handler" is a type of request for TheMovieDatabase API (in other words, a GET described here: https://developers.themoviedb.org/3/).
        //watch closely here for handler_parameters format in each case!
        switch (handler) {
            case "TMDB_trending":
                this.handler = new TMDB_trending("movie", "week");
                break;
            case "TMDB_search":
                const { queryString, page, language } = handler_parameters; //destruct object into separate parameters
                this.handler = new TMDB_search(queryString, page, language);
                break;
            case "TMDB_movieData":
                const {movie_id, movie_language} = handler_parameters;
                this.handler = new TMDB_movieData(movie_id, movie_language);
                break;
            case "TMDB_genres":
                const { genres_language } = handler_parameters;
                this.handler = new TMDB_genres(genres_language);
                break;
            default:
                throw new Error("Unknown handler for TMDB_URL_handler: " + handler);
        }
    }

    toString() {
        //Generate API URL: add host address and API key
        return this.TMDB_API + this.insertApiKey(this.handler.toString());
    }
};

exports.TMDB_URL_handler = TMDB_URL_handler;