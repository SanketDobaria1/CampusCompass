(function ($) {
  let current_page = 1;
  let total_page = 1;

  let responseData;

  function formatTime(time) {
    let timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!time || typeof time !== "string" || !timeRegex.test(time)) return "";
    let splitTime = time.split(":");
    return `${splitTime[0] % 12}:${splitTime[1]}:${splitTime[2]} ${
      splitTime[0] > 12 ? "PM" : "AM"
    }`;
  }

  function renderPagination() {
    $("#pagination").empty();
    let html = "";
    for (let i = 1; i <= total_page; i++) {
      if (i === current_page) {
        html += `<a href="#" class="active">${i}</span>`;
      } else {
        html += `<a href="#" data-page="${i}">${i}</a>`;
      }
    }
    $("#pagination").append(html);
  }

  function renderData(data) {
    if (data.length === 0) {
      $("#container").append("<h4>No Results</h4>");
      $("#pagination").attr("hidden", true);
      return;
    }
    function returnDay(day) {
      let dayIdDay = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
      };
      return dayIdDay[day];
    }

    $("html, body").animate({ scrollTop: 0 }, 0);
    data.forEach((department) => {
      let isOpen = "Closed";
      const date = new Date();
      const offset = date.getTimezoneOffset();
      date.setTime(date.getTime() - offset * 60 * 1000);
      date.setTime(date.getTime() - 5 * 60 * 60 * 1000);
      let weekday = date.getDay() === 0 ? 7 : date.getDay();
      let operating_days = [];
      department.operating_days.forEach((day) =>
        operating_days.push(returnDay(day))
      );
      operating_days = operating_days.join(", ");
      if (department.operating_days.includes(weekday)) {
        let tempDate = new Date(
          `${date.toISOString().slice(0, 10)} ${department.operating_hours[1]}`
        );

        if (tempDate > new Date()) isOpen = "Open";
      } else {
        isOpen = "Closed";
      }
      // isOpen = department.operating_days.includes(weekday) ? "Open" : "Closed";
      const div = `<div class="cards">
                <h2><a href="departments/${department._id}">${
        department.name
      }</a></h2>
                <dl>
                <dt>Operating Hours</dt>
                <dd>${formatTime(
                  department.operating_hours[0]
                )} to ${formatTime(department.operating_hours[1])}</dd>
                <dt>Operating Days</dt>
                <dd>${operating_days}</dd>
                <dt>Status</dt>
                <dd class="${isOpen}">${isOpen}</dd>
                <dt>Location</dt>
                <dd><a href="/locations/${department.location_id}">${
        department.location_name
      }</a></dd>  
                </dl>
                </div>
                </div>`;
      $("#department-container").append(div);
      // Toggle the "active" class on the collapsible button
      $(this).toggleClass("active");
    });
  }

  // Event listener for pagination links
  $("#pagination").on("click", (e) => {
    e.preventDefault();
    const page = parseInt(e.target.dataset.page);
    if (page && page !== current_page) {
      current_page = page;
      localStorage.setItem("department_current_page", current_page);
      $.ajax({
        url: `/departments/getAll?page=${current_page}`,
        success: function (response) {
          $("#container").empty();
          renderData(response.data);
          total_page = response.total_page;
          renderPagination();
        },
        error: function () {
          console.error("Failed to load data");
        },
      });
    }
  });

  $(document).ready(function () {
    $.ajax({
      url: "/departments/getAll",
      success: function (response) {
        responseData = response.data;
        renderData(response.data);
        total_page = response.total_page;
        renderPagination();
      },
      error: function () {
        console.error("Failed to load data");
      },
    });
  });
})(window.jQuery);
