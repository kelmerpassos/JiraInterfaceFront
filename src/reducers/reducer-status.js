import { STATUS_LIST } from "../actions";

export default function (state = null, action) {
    switch (action.type){
        case STATUS_LIST:
            if(action.payload.data){
                return action.payload.data;
            }
            return state;
        default:
            return state;
    }
}