var fetchJSON = require('./fetch_json');

var PER_PAGE = 100;

module.exports = {

    fetch: function(urlPath, options) {

        var firstPagePromise = fetchPage(0);

        return firstPagePromise.then(function(firstPage) {
            var pageCount = Math.ceil(firstPage.total_count / PER_PAGE);
            var pagePromises = [firstPagePromise]
            for (var i = 1; i < pageCount; i++) {
                pagePromises[i] = fetchPage(i);
            }
            return Promise.all(pagePromises);

        }).then(function(pages) {
            var items = [];
            for (var i = 0; i < pages.length; i++) {
                items = items.concat(pages[i].items);
            }
            return items;
        });

        function fetchPage(index) {
            return fetchJSON('https://api.github.com' + urlPath, Object.assign({}, options, {
                query: Object.assign({}, options.query, {
                    per_page: PER_PAGE,
                    page: index + 1
                }),
                headers: Object.assign({}, options.headers, {
                    Authentication: 'Basic ' + atob('lucaswoj:' + process.env.GITHUB_ACCESS_TOKEN)
                })
            }));
        }
    }

};

function atob(input) {
    return Buffer(input, 'binary').toString('base64');
}
