import {ROOT_URL, PROJECT_ID, BOARD_ID, ISSUE_METAKEY} from '../config';
import axios from 'axios';

export const SPRINT_ISSUES = 'sprint_issues',
             SPRINTS_LIST = 'sprints_list',
             ISSUES_LIST = 'issue_list',
             PROJECT_COMPONENTS = 'project_components',
             ISSUE = 'issue',
             ISSUE_UPDATE = 'issue_update',
             ISSUE_ATTACH = 'issue_attach',
             ISSUE_EDITMETA = 'issue_editmeta',
             PRIORITY_LIST = 'priority_list',
             STATUS_LIST = 'status_list',
             LOGIN = 'login';

export function sessionLogin(user, password) {
    const body = {
            user: user,
            password: password
        },
        request = axios.post(`${ROOT_URL}/login`, body);

    return {
        type: LOGIN,
        payload: request
    };
}

export function sessionLogout(token) {
    const body = {
            token: token
        },
        request = axios.post(`${ROOT_URL}/logout`, body);

    return {
        type: LOGIN,
        payload: request
    };
}

export function fetchSprintList(boardId) {

    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    boardId = boardId ? boardId : BOARD_ID;

    const request = axios.get(`${ROOT_URL}/board/${boardId}/sprint`, header);

    return {
        type: SPRINTS_LIST,
        payload: request
    };
}

export function fetchSprintIssues(id, filter) {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    filter = filter ? `?jql=${filter}` : '';

    const request = axios.get(`${ROOT_URL}/sprint/${id}/issue${filter}`, header);

    return {
        type: SPRINT_ISSUES,
        payload: request
    };
}

export function fetchIssueList(filter) {

    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
            headers: {
                token: login_session ? login_session.token : ''
            }
          };

    filter = filter ? `?jql=${filter}` : '';

    const request = axios.get(`${ROOT_URL}/issues${filter}`, header);

    return {
        type: ISSUES_LIST,
        payload: request
    };
}

export function fetchProjectComponents() {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    const request = axios.get(`${ROOT_URL}/project/${PROJECT_ID}/components`, header);

    return {
        type: PROJECT_COMPONENTS,
        payload: request
    };
}

export function fetchIssue(key) {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    const request = axios.get(`${ROOT_URL}/issues/${key}`, header);

    return {
        type: ISSUE,
        payload: request
    };
}

export function updateIssue(key, issue) {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    issue.lastUserUpdate = login_session ? login_session.userLogin: '';

    const request = axios.put(`${ROOT_URL}/issues/${key}`, issue, header);

    return {
        type: ISSUE_UPDATE,
        payload: request
    };
}

export function updateIssueField(key, issue, filed) {

    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    let updateIssue = {
            [filed]: issue[filed],
            lastUserUpdate: login_session ? login_session.userLogin: '',
        };

    const request = axios.put(`${ROOT_URL}/issues/${key}`, updateIssue, header);

    return {
        type: ISSUE_UPDATE,
        payload: request
    };
}

export function fetchIssueEditMeta() {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    const request = axios.get(`${ROOT_URL}/issues/${ISSUE_METAKEY}/editmeta`, header);

    return {
        type: ISSUE_EDITMETA,
        payload: request
    };
}

export function fetchAttachment(key, attach) {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);


    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    const body = {
            file: attach
        },
        request = axios.post(`${ROOT_URL}/issues/${key}/attachment`, body, header);

    return {
        type: ISSUE_ATTACH,
        payload: request
    };
}

export function fetchPriorityList() {
    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    const request = axios.get(`${ROOT_URL}/priority`, header);

    return {
        type: PRIORITY_LIST,
        payload: request
    };
}

export function fetchStatusList() {

    let login_session = localStorage.getItem('login_session');

    if(login_session){
        login_session = JSON.parse(login_session);
    }

    const header = {
        headers: {
            token: login_session ? login_session.token : ''
        }
    };

    const request = axios.get(`${ROOT_URL}/status`, header);

    return {
        type: STATUS_LIST,
        payload: request
    };
}