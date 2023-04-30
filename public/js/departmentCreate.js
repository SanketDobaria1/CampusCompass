(function ($) {
  let responseData;
  let roomsAPI = "/rooms/getRoomsDropdown/";
  let departmentCreateAPI = "/departments";
  $("#department-building-location").on("change", function () {
    let departmentID = $("#department-building-location").val();
    if (departmentID !== "#")
      $.ajax({
        url: roomsAPI + departmentID,
        success: function (response) {
          responseData = response;
          appendRooms(response.roomsData);
        },
        error: function () {
          window.alert("Please Reload page");
          console.log("failed to load data");
        },
      });
  });

  $("#department-create-form").on("submit", function (event) {
    event.preventDefault();
    let errors = [];
    $("#error-form").attr("hidden", true);
    let departmentName = $("#department-name").val().trim();
    let departmentDesc = $("#department-desc").val().trim();
    let openTime = $("#department-hour-start");
    let closeTime = $("#department-hour-end");
    let location = $("#department-building-location").val();
    let room = $("#department-room").val();
    let workinDays = $("#department-days").val();

    if (!departmentName || departmentName.length === 0)
      errors.push("Missing Department Name");

    if (location === "#") {
      errors.push("Please select location from dropdown");
      if (room === "#") errors.push("Missing room from dropdown");
    }

    if (openTime.val().trim().length === 0) errors.push("Missing Input time");
    if (closeTime.val().trim().length === 0) errors.push("Missing Input time");

    if (openTime.attr("type") === "time")
      openTime = openTime.val().trim() + ":00";
    if (closeTime.attr("type") === "time")
      closeTime = closeTime.val().trim() + ":00";

    if (!checkTime(openTime) || !checkTime(closeTime))
      errors.push("Please Check input time format");

    if (!checkOperatingTimes(openTime, closeTime))
      errors.push("Close time cannot be less than open time");

    if (workinDays.length === 0) errors.push("Please select working days");

    if (workinDays.includes(0)) workinDays = [0];

    if (errors.length === 0) {
      let responseJSON = {
        departmentName,
        departmentDesc,
        departmentOpen: openTime,
        departmentClose: closeTime,
        departmentLocationID: location,
        departmentRoomID: room,
        departmentWorkinDays: workinDays,
      };
      $.ajax({
        type: "POST",
        url: departmentCreateAPI,
        data: JSON.stringify(responseJSON),
        contentType: "application/json; charset=utf-8",

        success: function (response) {
          responseData = response;
          appendRooms(response.roomsData);
        },
        error: function (xhr, textStatus, error) {
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
        },
      });
    } else {
      $("#error-form").removeAttr("hidden");
      for (let i = 0; i < errors.length; i++)
        $("#error-form").append(`<p class="error">${errors[i]}</p>`);
    }
  });

  function appendRooms(response) {
    if (response.length === 0)
      window.alert("No Rooms available for Selected Location");
    $("#department-room-div").removeAttr("hidden");

    response.map((data) =>
      $("#department-room").append(
        `<option value="${data._id}">${data.room_number}</option>`
      )
    );
  }

  //validations function
  function checkOperatingTimes(startTime, endTime) {
    let startTimeDT = new Date(`01/01/2023 ${startTime}`);
    let endTimeDT = new Date(`01/01/2023 ${endTime}`);

    return endTimeDT > startTimeDT;
  }

  function checkTime(time) {
    let timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (typeof time !== "string") return false;
    time = time.trim();
    return timeRegex.test(time);
  }
})(window.jQuery);
