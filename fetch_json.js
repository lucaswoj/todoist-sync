var URL = require('url');
var fetch = require('node-fetch');
var querystring = require('querystring');

module.exports = function fetchJSON(url, options) {
    var parsedURL = URL.parse(url, true);
    Object.assign(parsedURL.query, options.query);
    url = URL.format(parsedURL);

    if (!(typeof options.body === 'string' || options.body  instanceof String)) {
        options.body = querystring.stringify(options.body);
    }

    return fetch(url, options).then(function(response) {
        return response.json();
    });
};
