var Promise = require('es6-promise').Promise;

function AsyncPaginatedList(fetchPage, pageSize, processPage){
    this.pages = {};
    this.totalFetched = 0;
    this.total = 0;
    this.complete = false;
    this.pageSize = pageSize;

    this.fetchPage = fetchPage;
    this.processPage = processPage || function(x) { return Promise.resolve(x) };
}


AsyncPaginatedList.prototype = {
    _loadPage: function(pageNumber) {
        var self = this;

        if(!this.pages[pageNumber]) {
            this.pages[pageNumber] = this.fetchPage(pageNumber, this.pageSize)
                .then(function(page){
                    return self.processPage(page);
                })
                .then(function(page){
                    self._addPage(pageNumber, page);
                    return Promise.resolve(page.items);
                });
        }

        return this.pages[pageNumber];
    },

    _addPage: function(pageNumber, page) {
        this.total =  page.total;
        this.totalFetched += page.count;
        this.complete = this.totalFetched === page.total;
    },

    getTotal: function() {
        return this.total;
    },

    isComplete: function() {
        return this.complete;
    },

    get: function(index) {
        var offset =  index % this.pageSize,
            pageNumber = Math.floor(index / this.pageSize);

        return this._loadPage(pageNumber).then(function(page){
            return Promise.resolve(page[offset]);
        });
    }
};

module.exports = AsyncPaginatedList;