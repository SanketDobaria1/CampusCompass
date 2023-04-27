
function events() {
    let staticForm = document.getElementById('feedback-form');
    if (staticForm) {
    let userIDField = document.getElementById('user_id');
    let eventTypeField = document.getElementById('event_type');
    let eventListField = document.getElementById('events_list');
    let DepartmentListField = document.getElementById('department_list');
    let locationsListField = document.getElementById('locations_list');
    let feedbackDescriptionField = document.getElementById('feedback_description');
    eventListField.hidden=true;
    eventTypeInput = eventTypeField.value
        if (eventTypeInput == "events"){
            eventListField.hidden=false;
            DepartmentListField.hidden=true;
            locationsListField.hidden=true;
        }
        else if (eventTypeInput == "departments"){
            DepartmentListField.hidden=false;
            eventListField.hidden=true;
            locationsListField.hidden=true;
        }
        else if (eventTypeInput == "locations"){
            locationsListField.hidden=false;
            eventListField.hidden=true;
            DepartmentListField.hidden=true;
        }

}
}
