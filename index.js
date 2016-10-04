var URL = require('url');
var syncGithubIssuesToTodoistItems = require('./sync_github_issues_to_todoist_items');

syncGithubIssuesToTodoistItems({

    githubQuery: (
        'is:pr -author:lucaswoj -label:"Under Construction" ' +
        'repo:mapbox/mapbox-gl-js repo:mapbox/mapbox-gl-function ' +
        'repo:mapbox/mapbox-gl-style-spec'
    ),

    todoistItemArgs: function(githubPR) {
        return {
            content: 'Review ' + githubPR.html_url,
            project_id: 181723478
        }
    }

})
.then(function(output) { console.log(output) })
.catch(function(error) { console.error(error) });

syncGithubIssuesToTodoistItems({

    githubQuery: 'is:issue assignee:lucaswoj user:mapbox',

    todoistItemArgs: function(githubPR) {
        return {
            content: 'Resolve ' + githubPR.html_url,
            project_id: 181726274
        }
    }

})
.then(function(output) { console.log(output) })
.catch(function(error) { console.error(error) });

syncGithubIssuesToTodoistItems({

    githubQuery: 'is:pr author:lucaswoj user:mapbox',

    todoistItemArgs: function(githubPR) {
        return {
            content: 'Ship ' + githubPR.html_url,
            project_id: 181726274
        }
    }

})
.then(function(output) { console.log(output) })
.catch(function(error) { console.error(error) });
