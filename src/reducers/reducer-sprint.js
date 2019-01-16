import { SPRINT_ISSUES, SPRINTS_LIST } from "../actions";

export function SprintListReducer (state = null, action) {
    switch (action.type){
        case SPRINTS_LIST:
            if(action.payload.data){

                action.payload.data.futures = action.payload.data.filter(sprint => sprint.canEdit);
                
                const noSprint = action.payload.data.futures.filter(sprint => sprint.id === null);

                if(!noSprint[0]){
                    action.payload.data.futures.push({
                        id: null,
                        name: 'Sem Sprint',
                        canEdit: true
                    });
                }

                return action.payload.data;
            }
            return state;
        default:
            return state;
    }
}

export function SprintIssueReducer (state = {}, action) {
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