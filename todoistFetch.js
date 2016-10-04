var fetchJSON = require('./fetchJSON');

module.exports = function(options) {
    return fetchJSON('https://todoist.com/API/v7/sync', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: compactObject({
            sync_token: '*',
            token: process.env.TODOIST_ACCESS_TOKEN,
            commands: JSON.stringify(options.commands),
            resource_types: JSON.stringify(options.resource_types)
        })
    });
};

function compactObject(input) {
    var output = {};
    for (var key in input) {
        if (input[key] != null) {
            output[key] = input[key];
        }
    }
    return output;
}
