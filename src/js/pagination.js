class Pagination { //singleton!
    currentSearchString;
    currentPage;
    //  perPage = 20; //Default TMDB response is 20 items per page
    #totalEntries = 0;
    #totalPages = 0;

    constructor(currentSearchString = "", totalEntries, totalPages) {
        if (typeof Pagination.instance === 'object') {
            return Pagination.instance;
        }
        this.currentSearchString = currentSearchString;
        this.currentPage = 1;
        this.setPages(totalEntries, totalPages);

        Pagination.instance = this;
        return Pagination.instance;
    }

    setPages(totalEntries = 0, totalPages = 0) {
        this.#totalEntries = totalEntries;
        this.#totalPages = totalPages;
    }

    getEntries() {
        return this.#totalEntries;
    }

    getTotalPages() {
        return this.#totalPages;
    };

    resetNewPage(searchString, totalEntries, totalPages) {
        this.currentSearchString = searchString;
        this.currentPage = 1;
        this.setPages(totalEntries, totalPages);
    }

    checkNextPage() {
        if (this.#totalPages <= this.currentPage) {
            return false; //we're at the last page 
        }
        return true; //we can do another page
    }

    setCurrentPage(page = 1) {
        this.currentPage = page;
    }

    movePage(direction) {
        switch (direction) {
            case 'next':
                if (this.checkNextPage() === false) {
                    return false; //there is no next page
                }
                this.currentPage += 1;
                break;
            case 'prev':
                if (this.currentPage <= 1) {
                    return false; //there is no prev page
                }
                this.currentPage -= 1;
                break;
            case 'first':
                if (this.currentPage === 1) {
                    return false; //we're at the first page 
                }
                this.setCurrentPage(1);
                break;
            case 'last':
                if (this.getTotalPages() === this.currentPage) {
                    return false; //we're at the last page
                }
                this.setCurrentPage(this.getTotalPages());
                break;
            default:
                console.error("Unknown direction of next page.");
                return false;
        }
        return true;
    }
};

exports.Pagination = Pagination;