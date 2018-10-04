import {ISSUES_LIST, ISSUE} from "../actions";

export function IssueReducer (state = null, action) {
    switch (action.type){
        case ISSUE:
            if(action.payload.data){
                if(action.payload.data.description){
                    action.payload.data.description = action.payload.data.description.replace(/https:\/\/servimex.atlassian.net\/browse/gi,'/issue');
                }

                if(action.payload.data.solution_test){
                    action.payload.data.solution_test = action.payload.data.solution_test.replace(/\/browse/gi,'/issue');
                }

                action.payload.data.infoAttaches = [];
                action.payload.data.docAttaches = [];
                action.payload.data.manualAttaches = [];
                let attach = {};

                for(let i = 0; i < action.payload.data.attachment.length; i++){
                    attach = action.payload.data.attachment[i];

                    if(/\[INFO\]/gi.test(attach.filename)){
                        attach.filename = attach.filename.replace(/\[INFO\]/gi,'');
                        attach.moved = true;
                        action.payload.data.infoAttaches.push(attach);
                    }

                    if(/\[(DOC|VAL)\]/gi.test(attach.filename)){
                        attach.filename = attach.filename.replace(/\[(DOC|VAL)\]/gi,'');
                        attach.moved = true;
                        action.payload.data.docAttaches.push(attach);
                    }

                    if(/\[MANUAL\]/gi.test(attach.filename)){
                        attach.filename = attach.filename.replace(/\[MANUAL\]/gi,'');
                        attach.moved = true;
                        action.payload.data.manualAttaches.push(attach);
                    }
                }

                action.payload.data.attachment = action.payload.data.attachment.filter( attach => !attach.moved);

                action.payload.data.groupComponents = action.payload.data.components.map((component) =>" "+ component.name).toString();
                action.payload.data.groupFixVersions = action.payload.data.fixVersions.map((version) =>" "+ version.name).toString();

                return action.payload.data;
            }
            return state;
        default:
            return state;
    }
}

export function IssueListReducer (state = null, action) {
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