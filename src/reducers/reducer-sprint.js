import { SPRINT_ISSUES} from "../actions";

export default function (state = {}, action) {
    switch (action.type){
        case SPRINT_ISSUES:
            return action.payload.data;
        default:
            return state;
    }
}