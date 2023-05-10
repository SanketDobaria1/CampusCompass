$(document).ready(function () {
  let responseData;
  let departmentGetAllEP = "/departments/getAllRecords";
  let locationGetAllEP = "/locations/getAllRecords";
  let roomsGetAllEP = "";
  $("#form-search").submit(function (event) {
    event.preventDefault();
  });
  $("#search-type").change(function () {
    $("#search-string-div").removeAttr("hidden");

    let searchTypeValue = $("#search-type").val();

    if (searchTypeValue === "department") {
      getData(departmentGetAllEP);
    }
    if (searchTypeValue === "location") {
      getData(locationGetAllEP);
    }
  });

  function returnDay(day) {
    let dayIdDay = {
      0: "Open All Days",
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
  function formatTime(time) {
    let timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!time || typeof time !== "string" || !timeRegex.test(time)) return "";
    let splitTime = time.split(":");
    return `${
      splitTime[0] % 12
    }:${splitTime[1]}:${splitTime[2]} ${splitTime[0] > 12 ? "PM" : "AM"}`;
  }

  function getData(endpoint) {
    $.ajax({
      url: endpoint,
      success: function (response) {
        responseData = response;
        bindChangeRender(response);
      },
      error: function () {
        console.log("failed to load data");
      },
    });
  }
  function renderAdditionalFilter(filterList, referenceObjectByID) {
    $(referenceObjectByID).removeAttr("hidden");
    let optionsToRemove = $(referenceObjectByID).find(
      "option:not(:first-child)"
    );
    $(optionsToRemove).remove();
    if (filterList.length > 1)
      filterList.map((filterType) => {
        $(referenceObjectByID).append(
          `<option value="${filterType}">${filterType}</option>`
        );
      });
  }

  function filterResponse(responseData, filterValue, searchValue) {
    if (filterValue !== "#")
      responseData = responseData.filter((elm) => elm.type === filterValue);
    if (searchValue && searchValue.length > 0)
      responseData = responseData.filter(
        (elm) => elm["name"].toLowerCase().indexOf(searchValue) > -1
      );
    return responseData;
  }

  function renderData(response) {
    $("#results").removeAttr("hidden");
    $("#results").empty();
    if (response.length > 0) {
      response.map((element) => {
        let days = "";
        if (element.operating_days) {
          element.operating_days.sort((a, b) => a - b);
          days = element.operating_days.map((day) => returnDay(day));
          days = `<dt>Working Days</dt><dd>${days.join(", ")}</dd>`;
        }
        const div = `
        <div class="cards">
          <h2><a href="${$("#search-type").val()}s/${element._id}">${
          element.name
        }</a></h2>
          <dl>
            <dt>Type</dt>
            <dd>${element.type}</dd>
            ${days}
            <dt>Operating Hours</dt>
            <dd>${formatTime(element.operating_hours[0])} : ${formatTime(
          element.operating_hours[1]
        )}</dd>
          </dl>
        </div>`;
        $("#results").append(div);
      });
    } else $("#results").append("<h2>No Records</h2>");
  }

  function bindChangeRender(rawResponse) {
    let response = rawResponse.data;
    renderData(response);
    if (rawResponse.uniqueTypes.length > 1) {
      $("#search-additional").removeAttr("hidden");
      renderAdditionalFilter(
        rawResponse.uniqueTypes,
        "#search-type-additional"
      );
    } else {
      $("#search-additional").attr("hidden", "true");
      renderData(response);
    }

    let filteredResponseList = [];
    $(".form-input").on("input", function () {
      let additionalFilter = $("#search-type-additional").val();
      let searchStringVal = $("#search-string").val().trim().toLowerCase();
      if (additionalFilter !== "#" || searchStringVal.length > 0) {
        filteredResponseList = filterResponse(
          response,
          additionalFilter,
          searchStringVal
        );

        filteredResponseList.length > 0
          ? renderData(filteredResponseList)
          : renderData(response);
        filteredResponseList = [];
      } else {
        renderData(response);
      }
    });
  }
});
