$(document).ready(function () {
  $("#form-signup").submit(function (event) {
    event.preventDefault();

    $("#error-form").attr("hidden", true);
    let user_email = $("#user_email").val();
    let user_password = $("#user_password").val();
    let user_name = $("#user_name").val();
    let user_department = $("#user_department").val();
    let errors = [];

    if ($.trim(user_name).length === 0) errors.push("Please Insert UserName");
    if ($.trim(user_password).length < 6)
      errors.push("Please Insert Password of length greater than 6");
    if (!validStevensEmail(user_email))
      errors.push("Please Input Proper stevens Email");
    if (user_department === "#")
      errors.push("Please Select proper department From Dropdown");

    if (errors.length > 0) {
      $("#error-form").removeAttr("hidden");
      for (let i = 0; i < errors.length; i++) {
        let errorParagraph = $(`<p class="error">${errors[i]}</p>`);
        $("#error-form").append(errorParagraph);
        removeErrorAfterTime(errorParagraph, 3000);
      }
    } else {
      $("#error-form").prop("hidden");
      $("#form-signup").off("submit").submit();
    }
  });
});

function validStevensEmail(emailid) {
  let regex = /^[\w._%+-]+(@stevens\.edu)$/;
  return regex.test(emailid);
}

function checkName(name) {
  name = name.trim().toLowerCase();
  let regex = /^[a-zA-Z]{2,25}$/;
  return regex.test(name);
}

function checkPassword(password) {
  password = password.trim();
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
  return regex.test(password);
}


function removeErrorAfterTime(errorElement, time) {
  setTimeout(function () {
    errorElement.remove();
    if ($("#error-form").children().length === 0) {
      $("#error-form").attr("hidden", true);
    }
  }, time);
}

