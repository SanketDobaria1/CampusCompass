$(document).ready(function () {
  $.ajax({
    url: "/events/getAll",
    type: "GET",
    success: function (data) {
      $("#event-results").removeAttr("hidden");
      for (let x of data) {
        const div = `<div classname="event">
                  <h3>${x.name}<h3>
                  </div>`;
        $("#event-results").append(div);
      }
    },
  });
});

$(document).ready(function () {
  $(".delete").on("click", function () {
    const eventId = $(this).data("id");
    $.ajax({
      url: "/events/" + eventId,
      type: "DELETE",
      success: function () {
        // Remove the deleted event from the DOM
        $(this).parent().remove();
        // Show notification to user
        const notification = $("<div>")
          .text("Event deleted successfully!")
          .addClass("notification success");
        $("body").append(notification);
        // Remove notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
      },
      error: function () {
        // Something went wrong, show error notification
        const notification = $("<div>")
          .text("Failed to delete event.")
          .addClass("notification error");
        $("body").append(notification);
        // Remove notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
      },
    });
  });

  // Edit event
  $(".edit").click(function () {
    window.location.href = "/events/edit/" + $(this).data("id");
  });
});
