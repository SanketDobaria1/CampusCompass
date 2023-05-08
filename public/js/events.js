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

  // Register for event
  $(".register-button").click(function (event) {
    event.preventDefault();
    const eventId = $(this).data("id");
    $.ajax({
      url: "/events/register/" + eventId,
      type: "POST",
      data: {
        // Include any additional registration data as needed
      },
      success: function () {
        // Show success notification to user
        const notification = $("<div>")
          .text("Registered for event successfully!")
          .addClass("notification success");
        $("body").append(notification);
        // Remove notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
      },
      error: function () {
        // Something went wrong, show error notification
        const notification = $("<div>")
          .text("Failed to register for event.")
          .addClass("notification error");
        $("body").append(notification);
        // Remove notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
      },
    });
  });
});
