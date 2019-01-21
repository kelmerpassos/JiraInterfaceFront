import {ISSUES_LIST, ISSUE, ISSUE_EDITMETA} from "../actions";

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

                if(!action.payload.data.sprint){
                    action.payload.data.sprint = {
                        id: null,
                        name: 'Sem Sprint',
                        canEdit: true
                    }
                }

                action.payload.data.infoAttaches = [];
                action.payload.data.docAttaches = [];
                action.payload.data.manualAttaches = [];
                let attach = {};

                for(let i = 0; i < action.payload.data.attachment.length; i++){
                    attach = action.payload.data.attachment[i];

                    if(/\[OCULTAR\]/gi.test(attach.filename)){
                        attach.moved = true;
                    }

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
                action.payload.data.groupDepartments = action.payload.data.departments.map((department) =>" "+ department.value).toString();

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

            localStorage.removeItem('issue_list');

            if(action.payload.data){
                for (let i = 0; i < action.payload.data.length; i++) {
                    action.payload.data[i].groupComponents = action.payload.data[i].components.map((component) =>" "+ component.name).toString();
                    action.payload.data[i].groupDepartments = action.payload.data[i].departments.map((department) =>" "+ department.value).toString();
                    action.payload.data[i].groupFixVersions = action.payload.data[i].fixVersions.map((version) =>" "+ version.name).toString();
                    action.payload.data[i].priorityId = action.payload.data[i].priority ? action.payload.data[i].priority.id : -1;
                }

                localStorage.setItem('issue_list', JSON.stringify(action.payload.data));
                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}

export function IssueEditMetaReducer (state = {}, action) {
    switch (action.type){
        case ISSUE_EDITMETA:
            if(action.payload.data){
                action.payload.data.departments = action.payload.data['customfield_10040'].allowedValues;
                action.payload.data.productOwners = action.payload.data['customfield_10036'].allowedValues;
                action.payload.data.requireHomologValues = action.payload.data['customfield_10037'].allowedValues;

                return action.payload.data;
            }

            return state;
        default:
            return state;
    }
}