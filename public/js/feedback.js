import eventdata from '../../data/events.js'
import locationsdata from '../../data/locations.js'
import departmentsdata from '../../data/departments.js'


function events() {
    let staticForm = document.getElementById('feedback-form');
    if (staticForm) {
    let userIDField = document.getElementById('user_id');
    let eventTypeField = document.getElementById('event_type');
    let eventListField = document.getElementById('event_list');
    let feedbackDescriptionField = document.getElementById('feedback_description');

    eventTypeField.addEventListener(onchange, () => {
        let eventTypeInput = eventTypeField.value;
        eventListField.innerHTML = "";
        if (eventTypeInput == "events"){
            let events = eventdata.getAll()
            for (let i=0;i<events.length();i++){
                let option = document.createElement("option");
                option.text = events[i].name;
                option.value = events[i]._id;
                eventListField.options.add(option, 0);
            }
        }
        else if (eventTypeInput == "departments"){
            let events = departmentsdata.getDepartmentAll()
            for (let i=0;i<events.length();i++){
                let option = document.createElement("option");
                option.text = events[i].name;
                option.value = events[i]._id;
                eventListField.options.add(option, 0);
            }
        }
        else if (eventTypeInput == "locations"){
            let events = locationsdata.getAll()
            for (let i=0;i<events.length();i++){
                let option = document.createElement("option");
                option.text = events[i].name;
                option.value = events[i]._id;
                eventListField.options.add(option, 0);
            }
        }
        
    });
}
}