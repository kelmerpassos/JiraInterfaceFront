import { combineReducers } from 'redux';
import SprintReducer from './reducer-sprint';
import ComponentsReducer from './reducer-components';
import {ListIssueReducer, IssueReducer} from './reducer-issue';
import PriorityReducer from './reducer-priority';

const rootReducer = combineReducers({
    sprint: SprintReducer,
    list_issues: ListIssueReducer,
    components: ComponentsReducer,
    issue: IssueReducer,
    priorities: PriorityReducer,
});

export default rootReducer;