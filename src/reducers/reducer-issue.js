import { ISSUE } from "../actions";

export default function (state = null, action) {
    switch (action.type){
        case ISSUE:
            if(action.payload.data){
                if(action.payload.data.description){
                    action.payload.data.description = action.payload.data.description.replace(/https:\/\/servimex.atlassian.net\/browse/gi,'/issue');
                }

                action.payload.data.groupComponents = action.payload.data.components.map((component) =>" "+ component.name).toString();
                action.payload.data.groupFixVersions = action.payload.data.fixVersions.map((version) =>" "+ version.name).toString();

                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}