import axios from 'axios';

export const SPRINT_ISSUES = 'sprint_issues',
             BACKLOG_ISSUES = 'backlog_issues',
             PROJECT_COMPONENTS = 'project_components',
             ISSUE = 'issue',
             ISSUE_ATTACH = 'issue_attach',
             PRIORITIES = 'priorities';

const ROOT_URL = "http://localhost:3000";

const PROJECT_ID = 10000;

export function fetchSprintIssues(filter) {

    filter = filter ? `?jql=${filter}` : '';

    const request = axios.get(`${ROOT_URL}/sprint${filter}`);

    return {
        type: SPRINT_ISSUES,
        payload: request
    };
}

export function fetchBacklogIssues(filter) {

    filter = filter ? `?jql=${filter}` : '';

    const request = axios.get(`${ROOT_URL}/issues${filter}`);

    return {
        type: BACKLOG_ISSUES,
        payload: request
    };
}

export function fetchProjectComponents() {
    const request = axios.get(`${ROOT_URL}/project/${PROJECT_ID}/components`);

    return {
        type: PROJECT_COMPONENTS,
        payload: request
    };
}

export function fetchIssue(key) {
    const request = axios.get(`${ROOT_URL}/issues/${key}`);

    return {
        type: ISSUE,
        payload: request
    };
}

export function fetchAttachment(key, attach) {
    const body = {
          file: attach
        },
       request = axios.post(`${ROOT_URL}/issues/${key}/attachment`, body);

    return {
        type: ISSUE_ATTACH,
        payload: request
    };
}

export function fetchPriorities() {
    const request = axios.get(`${ROOT_URL}/priority`);

    return {
        type: PRIORITIES,
        payload: request
    };
}