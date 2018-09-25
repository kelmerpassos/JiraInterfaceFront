import {ISSUES_LIST, ISSUE} from "../actions";

export function IssueReducer (state = null, action) {
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

export function ListIssueReducer (state = null, action) {
    switch (action.type){
        case ISSUES_LIST:
            if(action.payload.data){

                for (let i = 0; i < action.payload.data.length; i++) {
                    action.payload.data[i].groupComponents = action.payload.data[i].components.map((component) =>" "+ component.name).toString();
                    action.payload.data[i].groupFixVersions = action.payload.data[i].fixVersions.map((version) =>" "+ version.name).toString();
                    action.payload.data[i].priorityId = action.payload.data[i].priority ? action.payload.data[i].priority.id : -1;
                }

                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}