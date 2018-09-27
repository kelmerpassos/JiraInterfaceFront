import {ROOT_URL, PROJECT_ID, BOARD_ID} from '../config';
import axios from 'axios';

export const SPRINT_ISSUES = 'sprint_issues',
             SPRINTS_LIST = 'sprints_list',
             ISSUES_LIST = 'issue_list',
             PROJECT_COMPONENTS = 'project_components',
             ISSUE = 'issue',
             ISSUE_UPDATE = 'issue_update',
             ISSUE_ATTACH = 'issue_attach',
             PRIORITY_LIST = 'priority_list',
             STATUS_LIST = 'status_list';

export function fetchSprintList(boardId) {

    boardId = boardId ? boardId : BOARD_ID;

    const request = axios.get(`${ROOT_URL}/board/${boardId}/sprint`);

    return {
        type: SPRINTS_LIST,
        payload: request
    };
}

export function fetchSprintIssues(id, filter) {
    filter = filter ? `?jql=${filter}` : '';

    const request = axios.get(`${ROOT_URL}/sprint/${id}/issue${filter}`);

    return {
        type: SPRINT_ISSUES,
        payload: request
    };
}

export function fetchIssueList(filter) {

    filter = filter ? `?jql=${filter}` : '';

    const request = axios.get(`${ROOT_URL}/issues${filter}`);

    return {
        type: ISSUES_LIST,
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

export function updateIssue(key, issue) {
    const request = axios.put(`${ROOT_URL}/issues/${key}`, issue);

    return {
        type: ISSUE_UPDATE,
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

export function fetchPriorityList() {
    const request = axios.get(`${ROOT_URL}/priority`);

    return {
        type: PRIORITY_LIST,
        payload: request
    };
}

export function fetchStatusList() {
    const request = axios.get(`${ROOT_URL}/status`);

    return {
        type: STATUS_LIST,
        payload: request
    };
}