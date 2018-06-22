import { BACKLOG_ISSUES} from "../actions";

export default function (state = {}, action) {
    switch (action.type){
        case BACKLOG_ISSUES:
            if(action.payload.data){

                for (let i = 0; i < action.payload.data.length; i++) {
                    action.payload.data[i].groupComponents = action.payload.data[i].components.map((component) =>" "+ component.name).toString();
                }

                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}