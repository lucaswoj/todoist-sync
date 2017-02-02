#!/usr/bin/env node

var syncGithubIssuesToTodoistItems = require('./syncGithubIssuesToTodoistItems');

var mapboxProject = 181723387;
var deepWorkLabel = 1269254;

function githubIssueHasLabel(githubIssue, labelName) {
    return githubIssue.labels.some(function(label) {
        return label.name.includes(labelName);
    });
}

syncGithubIssuesToTodoistItems({
    githubQuery: 'is:pr -author:lucaswoj repo:mapbox/mapbox-gl-js',
    todoistItemArgs: function(githubIssue) {
        var isBlocked = githubIssueHasLabel(githubIssue, 'under development')
        return {
            content: 'Review PR: ' + githubIssue.html_url,
            in_history: booleanToNumber(githubIssue.state === 'closed' || isBlocked),
            priority: 2
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
    githubQuery: 'is:issue assignee:lucaswoj user:mapbox',
    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Resolve issue: ' + githubIssue.html_url,
            in_history: booleanToNumber(githubIssue.state === 'closed')
        };
    },
    newTodoistItemArgs: function(githubIssue) {
        return {
            labels: [deepWorkLabel],
            project_id: mapboxProject
        }
    }
})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

syncGithubIssuesToTodoistItems({
    githubQuery: 'is:pr author:lucaswoj user:mapbox',
    todoistItemArgs: function(githubIssue) {
        return {
            content: 'Ship PR: ' + githubIssue.html_url,
            in_history: booleanToNumber(githubIssue.state === 'closed')
        };
    },
    newTodoistItemArgs: function(githubIssue) {
        return {
            labels: [deepWorkLabel],
            project_id: mapboxProject
        }
    }
})
.then(function(output) { console.log(output); })
.catch(function(error) { console.error(error.stack); });

function booleanToNumber(input) {
    return input ? 1 : 0;
}
