$(document).ready(function () {
  $.ajax({
    url: "/departments/getAll",
    type: "GET",
    success: function (data) {
      $("#department-results").removeAttr("hidden");
      for (let x of data) {
        const div = `<div classname="department">
                <h3>${x.name}<h3>
                </div>`;
        $("#department-results").append(div);
      }
    },
  });
});
