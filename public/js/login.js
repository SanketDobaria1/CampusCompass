$(document).ready(function () {
  $("#form-login").submit(function (event) {
    event.preventDefault();
    let user_name = $("#login_email").val();
    let user_password = $("#login_password").val();
    let errors = [];

    $("p.error").remove();

    if ($.trim(user_name).length === 0 || !validStevensEmail(user_name))
      errors.push("Expected Stevens Email ID");

    if ($.trim(user_password).length === 0) errors.push("Expected Password");

    if (errors.length > 0) {
      $("#error-form").removeAttr("hidden");
      for (let i = 0; i < errors.length; i++) {
        let errorParagraph = $(`<p class="error">${errors[i]}</p>`);
        $("#error-form").append(errorParagraph);
        removeErrorAfterTime(errorParagraph, 3000);
      }
    } else {
      $("#error-form").prop("hidden");
      $("#form-login").off("submit").submit();
    }
  });
});

function validStevensEmail(emailid) {
  let regex = /^[\w._%+-]+(@stevens\.edu)$/;
  return regex.test(emailid);
}

function removeErrorAfterTime(errorElement, time) {
  setTimeout(function () {
    errorElement.remove();
    if ($("#error-form").children().length === 0) {
      $("#error-form").attr("hidden", true);
    }
  }, time);
}
