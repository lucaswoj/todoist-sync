var fetchJSON = require('./fetch_json');

module.exports = {

    read: function(resourceTypes) {
        return fetchJSON('https://todoist.com/API/v7/sync', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: {
                sync_token: '*',
                resource_types: JSON.stringify(resourceTypes || ['all']),
                token: process.env.TODOIST_ACCESS_TOKEN
            }
        });
    },

    write: function(commands) {
        return fetchJSON('https://todoist.com/API/v7/sync', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: {
                commands: JSON.stringify(commands),
                token: process.env.TODOIST_ACCESS_TOKEN
            }
        });
    }

};
