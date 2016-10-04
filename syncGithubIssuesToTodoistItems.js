var uuid = require('node-uuid');
var todoistFetch = require('./todoistFetch');
var githubFetch = require('./githubFetch');

module.exports = function syncGithubIssuesToTodoistItems(options) {

    var commands = [];
    var githubIssuesPromise = githubFetch('/search/issues', {query: { q: options.githubQuery }});
    var todoistItemsPromise = todoistFetch({resource_types: ['items']}).then(function(result) { return result.items; });

    return Promise.all([githubIssuesPromise, todoistItemsPromise]).then(function(results) {
        var githubIssues = results[0];
        var todoistItems = results[1];


        for (var i = 0; i < githubIssues.length; i++) {
            var githubIssue = githubIssues[i];
            var args = options.todoistItemArgs(githubIssue);

            var regexp = new RegExp('\\b' + escapeRegExp(githubIssue.html_url) + '\\b');

            var todoistItem = todoistItems.find(function(todoistItem) {
                return todoistItem.content.match(regexp);
            });

            if (todoistItem) {
                if (!args.checked && !todoistItem.is_deleted) {
                    commands.push({
                        type: 'item_update',
                        uuid: uuid.v4(),
                        args: Object.assign({}, args, { id: todoistItem.id })
                    });
                } else if (!todoistItem.checked && !todoistItem.is_deleted) {
                    commands.push({
                        type: 'item_delete',
                        uuid: uuid.v4(),
                        args: { ids: [todoistItem.id] }
                    });
                }

            } else if (!args.checked) {
                commands.push({
                    type: 'item_add',
                    uuid: uuid.v4(),
                    temp_id: uuid.v4(),
                    args: args
                });
            }
        }

        return todoistFetch({commands: commands});
    });
};

function escapeRegExp(input) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
