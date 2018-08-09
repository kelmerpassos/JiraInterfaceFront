import { SPRINT_ISSUES } from "../actions";

export default function (state = {}, action) {
    switch (action.type){
        case SPRINT_ISSUES:
            if(action.payload.data){

                for (let i = 0; i < action.payload.data.length; i++) {
                    action.payload.data[i].groupComponents = action.payload.data[i].components.map((component) =>" "+ component.name).toString();
                }

                for (let i = 0; i < action.payload.data.length; i++) {
                    action.payload.data[i].groupFixVersions = action.payload.data[i].fixVersions.map((version) =>" "+ version.name).toString();
                }

                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}