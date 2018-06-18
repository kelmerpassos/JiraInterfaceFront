import { combineReducers } from 'redux';
import SprintReducer from './reducer-sprint';
import BacklogReducer from './reducer-backlog';


const rootReducer = combineReducers({
    sprint: SprintReducer,
    backlog: BacklogReducer
});

export default rootReducer;