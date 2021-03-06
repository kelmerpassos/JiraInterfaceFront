import { PRIORITY_LIST } from "../actions";

export default function (state = null, action) {
    switch (action.type){
        case PRIORITY_LIST:
            if(action.payload.data){
                return action.payload.data;
            }
            return state;
        default:
            return state;
    }
}