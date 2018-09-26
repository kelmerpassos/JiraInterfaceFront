import { combineReducers } from 'redux';
import { SprintReducer, SprintIssueReducer} from './reducer-sprint';
import ComponentsReducer from './reducer-components';
import {ListIssueReducer, IssueReducer} from './reducer-issue';
import PriorityReducer from './reducer-priority';

const rootReducer = combineReducers({
    sprints: SprintReducer,
    sprint_issues: SprintIssueReducer,
    list_issues: ListIssueReducer,
    components: ComponentsReducer,
    issue: IssueReducer,
    priorities: PriorityReducer,
});

export default rootReducer;