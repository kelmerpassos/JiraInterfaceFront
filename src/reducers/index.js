import { combineReducers } from 'redux';
import SprintReducer from './reducer-sprint';
import BacklogReducer from './reducer-backlog';
import ComponentsReducer from './reducer-components';


const rootReducer = combineReducers({
    sprint: SprintReducer,
    backlog: BacklogReducer,
    components: ComponentsReducer
});

export default rootReducer;