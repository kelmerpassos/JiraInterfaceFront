import { combineReducers } from 'redux';
import { SprintListReducer, SprintIssueReducer} from './reducer-sprint';
import ComponentsReducer from './reducer-components';
import {IssueListReducer, IssueReducer, IssueEditMetaReducer} from './reducer-issue';
import PriorityListReducer from './reducer-priority';
import StatusListReducer from './reducer-status';
import LoginReducer from './reducer-login';
import AuthReducer from './reducer-auth';

const rootReducer = combineReducers({
    auth: AuthReducer,
    sprint_list: SprintListReducer,
    sprint_issues: SprintIssueReducer,
    issue_list: IssueListReducer,
    components: ComponentsReducer,
    issue_editmeta: IssueEditMetaReducer,
    issue: IssueReducer,
    priority_list: PriorityListReducer,
    status_list: StatusListReducer,
    login_session: LoginReducer,
});

export default rootReducer;