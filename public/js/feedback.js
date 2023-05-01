
function events() {
    let staticForm = document.getElementById('feedback-form');
    if (staticForm) {
    let userIDField = document.getElementById('reported_by');
    let eventTypeField = document.getElementById('event_type');
    let eventsListField = document.getElementById('events_list');
    let DepartmentListField = document.getElementById('department_list');
    let eventListField = document.getElementById('event_list');
    let locationsListField = document.getElementById('locations_list');
    let feedbackDescriptionField = document.getElementById('feedback_description');
    eventsListField.hidden=true;

    eventTypeInput = eventTypeField.value
        if (eventTypeInput == "events"){
            eventsListField.hidden=false;
            DepartmentListField.hidden=true;
            eventListField.hidden=true;
            locationsListField.hidden=true;
            
        }
        else if (eventTypeInput == "departments"){
            DepartmentListField.hidden=false;
            eventsListField.hidden=true;
            eventListField.hidden=true;
            locationsListField.hidden=true;
            
        }
        else if (eventTypeInput == "locations"){
            locationsListField.hidden=false;
            eventsListField.hidden=true;
            eventListField.hidden=true;
            DepartmentListField.hidden=true;
            
        }

}
}


function submitfeedback() {
    function checkId(id, varName) {
        if (!id) throw `Error: You must provide an ${varName} id to search for`;
        if (typeof id !== "string") throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
          throw `Error: ${varName} cannot be an empty string or just spaces`;
        return id;
    }
    function checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    }
    let staticForm = document.getElementById('feedback-form');
    if (staticForm) {
        let userIDField = document.getElementById('reported_by');
        let eventTypeField = document.getElementById('event_type');
        let eventsListField = document.getElementById('events_list');
        let DepartmentListField = document.getElementById('department_list');
        let eventListField = document.getElementById('event_list');
        let locationsListField = document.getElementById('locations_list');
        let feedbackDescriptionField = document.getElementById('feedback_description');
        let errorContainer = document.getElementById('error');
        let errorTextElement = errorContainer.getElementsByClassName('error-text')[0];
        eventsListField.hidden=true;

        staticForm.addEventListener('submit', (event) => {
            event.preventDefault();
        try{
            let userIDInput = userIDField.value
            let feedbackDescriptionInput = feedbackDescriptionField.value
            errorContainer.hidden=true;
            staticForm.classList.remove('error');
            let eventTypeInput = eventTypeField.value;
            if (eventTypeInput == "events"){
                let eventsListInput= checkId(eventsListField.value, "event id");
                if (DepartmentListField.length > 0) {
                    DepartmentListField.remove(DepartmentListField.length-1);
                }
                if (locationsListField.length > 0) {
                    locationsListField.remove(locationsListField.length-1);
                }
                if (eventListField.length > 0) {
                    eventListField.remove(eventListField.length-1);
                }
            }
            else if (eventTypeInput == "departments"){
                let DepartmentListInput= checkId(DepartmentListField.value, "event id");
                if (locationsListField.length > 0) {
                    locationsListField.remove(locationsListField.length-1);
                }
                if (eventListField.length > 0) {
                    eventListField.remove(eventListField.length-1);
                }
                if (eventsListField.length > 0) {
                    eventsListField.remove(eventsListField.length-1);
                }
            }
            else if (eventTypeInput == "locations"){
                let locationsListInput= checkId(locationsListField.value, "event id");
                if (DepartmentListField.length > 0) {
                    DepartmentListField.remove(DepartmentListField.length-1);
                }
                if (eventsListField.length > 0) {
                    eventsListField.remove(eventsListField.length-1);
                }
                if (eventListField.length > 0) {
                    eventListField.remove(eventListField.length-1);
                }
            }
            userIDInput= checkId(userIDInput, "user id");
            userIDInput= checkId(userIDInput, "event id");
            feedbackDescriptionInput= checkString(feedbackDescriptionInput, "feedback description");
            staticForm.submit();
        }
        catch(e){
            let message = typeof e === 'string' ? e : e.message;
            console.log("error")
            errorTextElement.textContent = e;
            errorContainer.hidden = false;
        }
    });
}

};



