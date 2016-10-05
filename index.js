var syncGithubIssuesToTodoistItems = require('./syncGithubIssuesToTodoistItems');

var afternoonLabel = 1268828;
var morningLabel = 1268827;
var mapboxReviewPRsProject = 181723478;
var mapboxWriteCodeProject = 181726274;

syncGithubIssuesToTodoistItems({

    githubQuery: (
        'is:pr -author:lucaswoj repo:mapbox/mapbox-gl-js ' +
        'repo:mapbox/mapbox-gl-function repo:mapbox/mapbox-gl-style-spec'
    ),

    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Review PR: ' + githubIssue.html_url,
            project_id: mapboxReviewPRsProject,
            labels: [morningLabel],
            checked: booleanToNumber(githubIssue.state === 'closed' || githubIssue.labels.find(function(label) {
                return label.name === 'under construction' || label.name === 'needs discussion';
            }))
        };
    }

})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

syncGithubIssuesToTodoistItems({
    githubQuery: 'is:issue assignee:lucaswoj user:mapbox',
    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Resolve issue: ' + githubIssue.html_url,
            project_id: mapboxWriteCodeProject,
            labels: [afternoonLabel],
            checked: booleanToNumber(githubIssue.state === 'closed')
        };
    }
})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

syncGithubIssuesToTodoistItems({
    githubQuery: 'is:pr author:lucaswoj user:mapbox',
    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Ship PR: ' + githubIssue.html_url,
            project_id: mapboxWriteCodeProject,
            labels: [afternoonLabel],
            checked: booleanToNumber(githubIssue.state === 'closed')
        };
    }

})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

function booleanToNumber(input) {
    return input ? 1 : 0;
}
