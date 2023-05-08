$(document).ready(function () {
  // Delete event
  $(".delete").on("click", function () {
    const eventId = $(this).data("id");

    // Show confirmation dialog
    const dialog = $("#custom-dialog");
    dialog.find(".dialog-title").text("Delete Event");
    dialog
      .find(".dialog-content")
      .html("<p>Are you sure you want to delete this event?</p>");
    dialog
      .find(".dialog-confirm")
      .off()
      .on("click", function () {
        // User confirmed, make AJAX call to delete event
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
            // Refresh page
            location.reload();
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

        // Close dialog
        closeDialog();
      });

    // Add event listener to cancel button
    dialog.find(".dialog-cancel").on("click", function () {
      // Close dialog
      closeDialog();
    });

    // Show dialog
    showDialog(dialog);
  });

  // Edit event
  $(".edit").click(function () {
    const eventId = $(this).data("id");

    // Show confirmation dialog
    const dialog = $("#custom-dialog");
    dialog.find(".dialog-title").text("Edit Event");
    dialog
      .find(".dialog-content")
      .html("<p>Are you sure you want to edit this event?</p>");
    dialog
      .find(".dialog-confirm")
      .off()
      .on("click", function () {
        // User confirmed, redirect to edit page
        window.location.href = "/events/edit/" + eventId;

        // Close dialog
        closeDialog();
      });
    // Add event listener to cancel button
    dialog.find(".dialog-cancel").on("click", function () {
      // Close dialog
      closeDialog();
    });

    // Show dialog
    showDialog(dialog);
  });

  // Register for event
  $(".register-button").click(function (event) {
    event.preventDefault();
    const eventId = $(this).data("id");

    // Show confirmation dialog
    const dialog = $("#custom-dialog");
    dialog.find(".dialog-title").text("Register for Event");
    dialog
      .find(".dialog-content")
      .html("<p>Are you sure you want to register for this event?</p>");
    dialog
      .find(".dialog-confirm")
      .off()
      .on("click", function () {
        // User confirmed, make AJAX call to register for event
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

        // Close dialog
        closeDialog();
      });
    // Add event listener to cancel button
    dialog.find(".dialog-cancel").on("click", function () {
      // Close dialog
      closeDialog();
    });

    // Show dialog
    showDialog(dialog);
  });

  // Helper functions for custom dialog
  function showDialog(dialog) {
    // Show dialog and overlay
    dialog.show();
    $("#custom-dialog-overlay").show();

    // Close dialog when overlay or close button is clicked
    $("#custom-dialog-overlay, .close-dialog").on("click", function () {
      closeDialog();
    });
  }

  function closeDialog() {
    // Hide dialog and overlay
    $(".dialog, .dialog-overlay").hide();
  }
});
