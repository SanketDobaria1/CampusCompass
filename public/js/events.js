$(document).ready(function () {
  validateForm("#event-create-form");
  validateForm("#event-edit-form");

  function validateForm(formId) {
    const form = $(formId);
    const eventName = form.find("#event_name");
    const eventDesc = form.find("#event_desc");
    const eventType = form.find("#event_type");
    const eventStartDate = form.find("#event_start_date");
    const eventEndDate = form.find("#event_end_date");
    const eventDays = form.find("#event_days");
    const openingHours = form.find("#opening_hours");
    const closingHours = form.find("#closing_hours");
    const locationId = form.find("#location_id");

    form.on("submit", function (e) {
      let isValid = true;

      // Event name validation
      if (eventName.val().trim() === "") {
        showError(eventName, "Event name is required");
        isValid = false;
      } else {
        clearError(eventName);
      }

      // Event description validation
      if (eventDesc.val().trim() === "") {
        showError(eventDesc, "Event description is required");
        isValid = false;
      } else {
        clearError(eventDesc);
      }

      // Event type validation
      if (eventType.val().trim() === "") {
        showError(eventType, "Event type is required");
        isValid = false;
      } else {
        clearError(eventType);
      }

      // Event date validation
      if (eventStartDate.val() === "" || eventEndDate.val() === "") {
        showError(eventStartDate, "Both start and end dates are required");
        isValid = false;
      } else if (eventStartDate.val() > eventEndDate.val()) {
        showError(eventStartDate, "Start date cannot be later than end date");
        isValid = false;
      } else {
        clearError(eventStartDate);
      }

      // Event days validation
      if (!eventDays.val()) {
        showError(eventDays, "At least one event day is required");
        isValid = false;
      } else {
        clearError(eventDays);
      }

      // Event hours validation
      if (openingHours.val() === "" || closingHours.val() === "") {
        showError(openingHours, "Both opening and closing hours are required");
        isValid = false;
      } else if (openingHours.val() >= closingHours.val()) {
        showError(
          openingHours,
          "Opening hours must be earlier than closing hours"
        );
        isValid = false;
      } else {
        clearError(openingHours);
      }

      // Location validation
      if (locationId.val().trim() === "") {
        showError(locationId, "Location is required");
        isValid = false;
      } else {
        clearError(locationId);
      }

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  function showError(input, message) {
    const errorMsg = input.next();
    errorMsg.text(message);
    input.addClass("invalid");
  }

  function clearError(input) {
    const errorMsg = input.next();
    errorMsg.text("");
    input.removeClass("invalid");
  }

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
