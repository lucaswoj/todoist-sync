#!/usr/bin/env node

var syncGithubIssuesToTodoistItems = require('./syncGithubIssuesToTodoistItems');
var mapboxProject = 181723387;

var afternoonLabel = 1269254;
var morningLabel = 1269253;
var blockedLabel = 1269275;

function githubIssueHasLabel(githubIssue, labelName) {
    return githubIssue.labels.some(function(label) {
        return label.name === labelName;
    });
}

syncGithubIssuesToTodoistItems({
    githubQuery: (
        'is:pr -author:lucaswoj repo:mapbox/mapbox-gl-js ' +
        'repo:mapbox/mapbox-gl-function repo:mapbox/mapbox-gl-style-spec'
    ),
    todoistItemArgs: function(githubIssue, todoistItem) {
        var isBlocked = githubIssueHasLabel(githubIssue, 'not ready for review') || githubIssueHasLabel(githubIssue, 'needs discussion');
        return {
            labels: arrayValueToggle(todoistItem && todoistItem.labels || [], blockedLabel, isBlocked),
            content: 'Review PR: ' + githubIssue.html_url,
            checked: booleanToNumber(githubIssue.state === 'closed')
        };
    },
    newTodoistItemArgs: function(githubIssue) {
        return {
            project_id: mapboxProject,
            labels: [morningLabel]
        }
    }
})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

syncGithubIssuesToTodoistItems({
    githubQuery: 'is:issue assignee:lucaswoj user:mapbox',
    todoistItemArgs: function(githubIssue) {
        return {
            labels: [afternoonLabel],
            content: 'Resolve issue: ' + githubIssue.html_url,
            checked: booleanToNumber(githubIssue.state === 'closed')
        };
    },
    newTodoistItemArgs: function(githubIssue) {
        return {
            project_id: mapboxProject
        }
    }
})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

syncGithubIssuesToTodoistItems({
    githubQuery: 'is:pr author:lucaswoj user:mapbox no:assignee',
    todoistItemArgs: function(githubIssue) {
        return {
            labels: [afternoonLabel],
            content: 'Ship PR: ' + githubIssue.html_url,
            checked: booleanToNumber(githubIssue.state === 'closed')
        };
    },
    newTodoistItemArgs: function(githubIssue) {
        return {
            project_id: mapboxProject
        }
    }
})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

function booleanToNumber(input) {
    return input ? 1 : 0;
}

function arrayValueToggle(array, value, toggle) {
    var index = array.indexOf(value);

    if (toggle && index === -1) {
        array.push(value);
    } else if (!toggle && index !== -1) {
        array.splice(index, 1);
    }

    return array;
}
