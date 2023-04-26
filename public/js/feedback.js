import eventdata from "../../data/events.js";

let staticForm = document.getElementById("feedback-form");
function eventFunction() {
  const selectElement = document.getElementById("mySelect");
  let events = eventdata.getAll();
  for (let i = 0; i < events.length(); i++) {
    let option = document.createElement("option");
    option.text = events[i].name;
    option.value = events[i]._id.toString();
    selectElement.options.add(option, 0);
  }
}
function submitFunction() {
  if (staticForm) {
    const textElement = document.getElementById("feedback_description");
    const resultContainer = document.getElementById("feedback-success");
    const errorContainer = document.getElementById("error");
    const errorTextElement =
      errorContainer.getElementsByClassName("error-text")[0];
    if (textValue.trim() == "") throw "please enter something";

    staticForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        resultContainer.hidden = false;
        staticForm.reset();
        textElement.focus();
      } catch (e) {
        const message = typeof e === "string" ? e : e.message;
        //console.log("error")
        errorTextElement.textContent = e;
        errorContainer.hidden = false;
        staticForm.reset();
        textElement.focus();
      }
    });
  }
}
