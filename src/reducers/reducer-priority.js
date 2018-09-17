import { PRIORITIES } from "../actions";

export default function (state = null, action) {
    switch (action.type){
        case PRIORITIES:

            if(action.payload.data){
                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}