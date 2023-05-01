
function events() {
    let staticForm = document.getElementById('feedback-form');
    if (staticForm) {
    let userIDField = document.getElementById('user_id');
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
