import { PROJECT_COMPONENTS } from "../actions";

export default function (state = null, action) {
    switch (action.type){
        case PROJECT_COMPONENTS:

            if(action.payload.data){

                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}