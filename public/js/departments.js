let current_page = 1;
if (localStorage.getItem("department_current_page"))
  current_page = localStorage.getItem("department_current_page");
let total_page = 1;

function renderPagination() {
  let html = "";
  for (let i = 1; i <= total_page; i++) {
    if (i === current_page) {
      html += `<span>${i}</span>`;
    } else {
      html += `<a href="#" data-page="${i}">${i}</a>`;
    }
  }
  $("#pagination").append(html);
}

function renderData(data) {
  data.forEach((department) => {
    const div = `<div class="cards">
                <h3>${department.name}<h3>
                <p>${department.type}</p>
                </div>`;
    $("#container").append(div);
  });
}

// Event listener for pagination links
$("#pagination").on("click", (e) => {
  e.preventDefault();
  const page = parseInt(e.target.dataset.page);
  if (page && page !== current_page) {
    current_page = page;
    localStorage.setItem("department_current_page", current_page);
    // Make the AJAX request with the new page number
    $.ajax({
      url: `/departments/getAll?page=${current_page}`,
      success: function (response) {
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
      renderData(response.data);
      total_page = response.total_page;
      renderPagination();
    },
    error: function () {
      console.error("Failed to load data");
    },
  });
});
