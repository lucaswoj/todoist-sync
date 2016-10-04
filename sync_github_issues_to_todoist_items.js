var uuid = require('node-uuid');

var linkPrefix = 'follows';

module.exports = function syncGithubIssuesToTodoistItems(options) {

    var todoistClient = require('./todoist_client');
    var todoistResourcesPromise = todoistClient.read(['notes', 'items']);

    var githubClient = require('./github_client');
    var githubPRsPromise = githubClient.fetch('/search/issues', {query: { q: options.githubQuery }});

    return Promise.all([githubPRsPromise, todoistResourcesPromise]).then(function(results) {
        var githubPRs = results[0];
        var todoistResources = results[1];
        var todoistWriteCommands = [];

        var lookup = createLookup(todoistResources.notes);

        for (var i = 0; i < githubPRs.length; i++) {
            var githubPR = githubPRs[i];

            if (githubPR.state === 'open') {

                if (lookup[githubPR.html_url]) {

                    todoistWriteCommands.push({
                        type: 'item_update',
                        uuid: uuid.v4(),
                        args: Object.assign({
                            id: lookup[githubPR.html_url],
                            checked: 0
                        }, options.todoistItemArgs(githubPR))
                    });

                } else {
                    var todoistItemId = uuid.v4();
                    todoistWriteCommands.push({
                        type: 'item_add',
                        uuid: uuid.v4(),
                        temp_id: todoistItemId,
                        args: Object.assign({
                            checked: 0
                        }, options.todoistItemArgs(githubPR))
                    });

                    todoistWriteCommands.push({
                        type: 'note_add',
                        uuid: uuid.v4(),
                        temp_id: uuid.v4(),
                        args: {
                            item_id: todoistItemId,
                            content: linkPrefix + ' ' + githubPR.html_url
                        }
                    });
                }

            } else if (lookup[githubPR.html_url]) {

                todoistWriteCommands.push({
                    type: 'item_update',
                    uuid: uuid.v4(),
                    args: Object.assign({
                        id: lookup[githubPR.html_url],
                        checked: 1
                    })
                });
            }
        }

        return todoistClient.write(todoistWriteCommands);
    });
}


function createLookup(resources) {
    var lookup = {};

    for (var i = 0; i < resources.length; i++) {
        var resource = resources[i];
        var itemId = resource.item_id;

        var regexp = new RegExp(linkPrefix + ' (https://github\.com/([^/]+)/([^/]+)/(pull|issues)/([0-9]+))', 'g');
        var match;
        while (match = regexp.exec(resource.content)) {
            lookup[match[1]] = itemId;
        } while (match);
    }

    return lookup;
}



function createTodoistIssue() {

}

function updateTodoistIssue() {

}
