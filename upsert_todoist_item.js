var todoistClient = require('./todoist_client');
var todoistItemsPromise = todoistClient.read(['items']).then(function(result) { return results.items });

module.exports = function upsertTodoistIssue(options) {

    return todoistItemsPromise.then(function() {
        for (var i = 0; i < todoistItems.length; i++) {
            var todoistItem = todoistItems[i];
            if (options.match(todoistItem)) {
                return todoist.queueCommand({
                    type: 'item_update',
                    uuid: uuid.v4(),
                    args: Object.assign({}, options.args, { id: todoistItem.id })
                });
            }
        }

        if (options.create !== false) {
            return todoist.queueCommand({
                type: 'item_add',
                uuid: uuid.v4(),
                temp_id: uuid.v4(),
                args: Object.assign(options.args)
            });
        }
    });

}
