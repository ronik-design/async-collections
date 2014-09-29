jest.autoMockOff();
var AsyncPaginatedList = require('../AsyncPaginatedList');
var Promise = require('es6-promise').Promise;

function getTestFechPage(total) {
    return function(pageNumber, maxPageSize) {
        var offset = pageNumber * maxPageSize,
            pageSize = Math.min(total - offset, maxPageSize),
            items = new Array(pageSize), i;

        for (i = 0; i < pageSize; i++) {
            items[i] = i + offset;
        }

        return new Promise(function (resolve) {
            resolve({
                items: items,
                count: items.length,
                total: total
            });
        });
    };
}


describe('AsyncPaginatedList', function() {
    pit('can get items based on index', function() {
        var list = new AsyncPaginatedList(getTestFechPage(36), 10);

        return list.get(0).then(function(value){
            expect(value).toBe(0);
        });
    });

    pit('can get a item with an index on the second page', function() {
        var list = new AsyncPaginatedList(getTestFechPage(36), 10);

        return list.get(11).then(function(value){
            expect(value).toBe(11);
        });
    });

    pit('can get an item with an index on the last page', function() {
        var list = new AsyncPaginatedList(getTestFechPage(36), 10);

        return list.get(35).then(function(value){
            expect(value).toBe(35);
        });
    });

    pit('can report the total items after the first get', function() {
        var list = new AsyncPaginatedList(getTestFechPage(36), 10);

        return list.get(0).then(function(){
            expect(list.getTotal()).toBe(36);
        });
    });

    pit('can tell when all items have been fetched', function() {
        var list = new AsyncPaginatedList(getTestFechPage(36), 10);

        return list.get(0).then(function(){
            expect(list.isComplete()).toBe(false);
        });
    });


    pit('can tell when all items have been fetched', function() {
        var list = new AsyncPaginatedList(getTestFechPage(36), 10);

        return Promise.all([list.get(0), list.get(11), list.get(21), list.get(31)]).then(function(){
            expect(list.isComplete()).toBe(true);
        });
    });

});