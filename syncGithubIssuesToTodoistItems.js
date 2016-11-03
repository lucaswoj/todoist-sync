var uuid = require('node-uuid');
var todoistFetch = require('./todoistFetch');
var githubFetch = require('./githubFetch');

module.exports = function syncGithubIssuesToTodoistItems(options) {

    var commands = [];
    var githubIssuesPromise = githubFetch('/search/issues', {query: { q: options.githubQuery }});
    var todoistResourcesPromise = todoistFetch({resource_types: ['items']}).then(function(result) { return result; });

    return Promise.all([githubIssuesPromise, todoistResourcesPromise]).then(function(results) {
        var githubIssues = results[0];
        var todoistResources = results[1];
        var todoistItems = todoistResources.items;

        for (var i = 0; i < githubIssues.length; i++) {
            var githubIssue = githubIssues[i];

            var regexp = new RegExp('\\b' + escapeRegExp(githubIssue.html_url) + '\\b');

            var todoistItem = todoistItems.find(function(todoistItem) {
                return todoistItem.content.match(regexp);
            });

            var args = options.todoistItemArgs(githubIssue, todoistItem);

            if (todoistItem) {
                commands.push({
                    type: 'item_update',
                    uuid: uuid.v4(),
                    args: Object.assign({}, args, { id: todoistItem.id })
                });

            } else if (!args.checked) {
                commands.push({
                    type: 'item_add',
                    uuid: uuid.v4(),
                    temp_id: uuid.v4(),
                    args: Object.assign(args, options.newTodoistItemArgs && options.newTodoistItemArgs(githubIssue))
                });
            }
        }

        return todoistFetch({commands: commands});
    });
};

function escapeRegExp(input) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
