import axios from 'axios';

export const SPRINT_ISSUES = 'sprint_issues',
             BACKLOG_ISSUES = 'backlog_issues';

const ROOT_URL = "http://localhost:3000";

export function fetchSprintIssues() {
    const request = axios.get(`${ROOT_URL}/sprint`);

    return {
        type: SPRINT_ISSUES,
        payload: request
    };
}

export function fetchBacklogIssues() {
    const request = axios.get(`${ROOT_URL}/issues`);

    return {
        type: BACKLOG_ISSUES,
        payload: request
    };
}