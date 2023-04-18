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
