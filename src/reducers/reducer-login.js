import {LOGIN} from "../actions";

export default function LoginReducer (state = null, action) {
    switch (action.type){
        case LOGIN:
            if(action.payload.data){

                action.payload.data.authenticated = true;

                return action.payload.data;
            }
            return state;
        default:
            return state;
    }
}