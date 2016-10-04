var URL = require('url');
var syncGithubIssuesToTodoistItems = require('./sync_github_issues_to_todoist_items');

syncGithubIssuesToTodoistItems({

    githubQuery: (
        'is:pr -author:lucaswoj repo:mapbox/mapbox-gl-js ' +
        'repo:mapbox/mapbox-gl-function repo:mapbox/mapbox-gl-style-spec'
    ),

    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Review PR: ' + githubIssue.html_url,
            project_id: 181723478,
            checked: booleanToNumber(githubIssue.state !== 'open' || githubIssue.labels.find(function(label) {
                return label.name === 'Under Construction'
            }))
        }
    }

})
.then(function(output) { console.log(output) })
.catch(function(error) { console.error(error.stack) });

syncGithubIssuesToTodoistItems({

    githubQuery: 'is:issue assignee:lucaswoj user:mapbox',

    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Resolve issue: ' + githubIssue.html_url,
            project_id: 181726274,
            checked: booleanToNumber(githubIssue.state !== 'open')
        }
    }

})
.then(function(output) { console.log(output) })
.catch(function(error) { console.error(error.stack) });

syncGithubIssuesToTodoistItems({

    githubQuery: 'is:pr author:lucaswoj user:mapbox',

    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Ship PR: ' + githubIssue.html_url,
            project_id: 181726274,
            checked: booleanToNumber(githubIssue.state !== 'open')
        }
    }

})
.then(function(output) { console.log(output) })
.catch(function(error) { console.error(error.stack) });

function booleanToNumber(input) {
    return input ? 1 : 0;
}
