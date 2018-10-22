import { combineReducers } from 'redux';
import { SprintListReducer, SprintIssueReducer} from './reducer-sprint';
import ComponentsReducer from './reducer-components';
import {IssueListReducer, IssueReducer, IssueEditMetaReducer} from './reducer-issue';
import PriorityListReducer from './reducer-priority';
import StatusListReducer from './reducer-status';

const rootReducer = combineReducers({
    sprint_list: SprintListReducer,
    sprint_issues: SprintIssueReducer,
    issue_list: IssueListReducer,
    components: ComponentsReducer,
    issue_editmeta: IssueEditMetaReducer,
    issue: IssueReducer,
    priority_list: PriorityListReducer,
    status_list: StatusListReducer,
});

export default rootReducer;