var uuid = require('node-uuid');
var todoistClient = require('./todoist_client');
var githubClient = require('./github_client');

module.exports = function syncGithubIssuesToTodoistItems(options) {

    var commands = [];
    var githubIssuesPromise = githubClient.fetch('/search/issues', {query: { q: options.githubQuery }});
    var todoistItemsPromise = todoistClient.fetch({resource_types: ['items']}).then(function(result) { return result.items; });

    return Promise.all([githubIssuesPromise, todoistItemsPromise]).then(function(results) {
        githubIssues = results[0];
        todoistItems = results[1];

        for (var i = 0; i < githubIssues.length; i++) {
            var githubIssue = githubIssues[i];
            var args = options.todoistItemArgs(githubIssue);

            var matches = 0;
            for (var j = 0; j < todoistItems.length; j++) {
                var todoistItem = todoistItems[j];
                if (todoistItem.content.includes(githubIssue.html_url)) {
                    matches++;
                    if (!args.checked) {
                        commands.push({
                            type: 'item_update',
                            uuid: uuid.v4(),
                            args: Object.assign({}, args, { id: todoistItem.id })
                        });
                    } else if (!todoistItem.checked) {
                        commands.push({
                            type: 'item_delete',
                            uuid: uuid.v4(),
                            args: { ids: [todoistItem.id] }
                        });
                    }
                }
            }

            if (!matches && !args.checked) {
                commands.push({
                    type: 'item_add',
                    uuid: uuid.v4(),
                    temp_id: uuid.v4(),
                    args: args
                });
            }
        }

        return todoistClient.fetch({commands: commands});
    });
}
