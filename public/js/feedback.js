(function ($) {
  let responseData;
  let roomsAPI = "/rooms/getRoomsDropdown/";
  let departmentsAPI = "/departments/getAllRecords";
  let locationsAPI = "/locations/getAllRecords";
  let eventsAPI = "/events/getAllRecords";

  $("#object_type").on("change", () => {
    let object_type = $("#object_type").val().trim();
    if (object_type === "departments") getRecords(departmentsAPI);
    if (object_type === "locations") getRecords(locationsAPI);
    if (object_type === "events") getRecords(eventsAPI);
  });

  $("#feedback-form").on("submit", (event) => {
    event.preventDefault();
    let object_type = $("#object_type").val().trim();
    let object_name = $("#reported_object").val().trim();
    let feedback = $("#feedback_description").val().trim();
    error = [];
    $("#errors").empty();
    if (object_type === "#") {
      error.push("Please Select Object Type");
    }
    if (object_name === "#") {
      error.push("Missing Object Name");
    }
    if (feedback.length === "0" || feedback === "") {
      error.push("Missing Feedback");
    }

    if (error.length === 0) {
      $.ajax({
        url: "/feedback",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          objectType: object_type,
          reportedObject: object_name,
          feedbackDesc: feedback,
        }),
        success: function (response) {
          if (response.feedbackCreated) {
            $("#msg").html("Feedback Created");
            $(".modal-title").text("Status");
            $("#myModal").modal("show");
            return;
          } else {
            location.reload();
          }
        },
        error: function (xhr, textStatus, error) {
          console.log(xhr.responseJSON);
          console.log(textStatus);
          console.log(error);
          $("#msg").html(xhr.responseJSON.error);
          $(".modal-title").text("Error");
          $("#myModal").modal("show");
          $("#errors").append(`<p class="error">${xhr.responseJSON.error}</p>`);
        },
      });
    } else {
      error.forEach((error) => {
        $("#errors").append(`<p>${error}</p>`);
      });
    }
  });

  function getRecords(url) {
    $.ajax({
      url: url,
      success: function (response) {
        responseData = response.data;
        appendDropdown(response.data);
      },
      error: function (xhr, textStatus, error) {
        location.reload();
      },
    });
  }

  function appendDropdown(data) {
    $("#reported-object-dropdown").removeAttr("hidden");
    let optionsToRemove = $("#reported_object").find(
      "option:not(:first-child)"
    );
    optionsToRemove.remove();
    if (data.length > 0) {
      data.forEach((element) => {
        $("#reported_object").append(
          `<option value="${element._id}">${element.name}</option>`
        );
      });
    }
  }
})(window.jQuery);
