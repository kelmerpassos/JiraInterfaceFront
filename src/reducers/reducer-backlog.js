import { BACKLOG_ISSUES} from "../actions";

export default function (state = {}, action) {
    switch (action.type){
        case BACKLOG_ISSUES:
            return action.payload.data;
        default:
            return state;
    }
}