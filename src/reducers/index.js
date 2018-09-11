import { combineReducers } from 'redux';
import SprintReducer from './reducer-sprint';
import BacklogReducer from './reducer-backlog';
import ComponentsReducer from './reducer-components';
import IssueReducer from './reducer-issue';

const rootReducer = combineReducers({
    sprint: SprintReducer,
    backlog: BacklogReducer,
    components: ComponentsReducer,
    issue: IssueReducer
});

export default rootReducer;