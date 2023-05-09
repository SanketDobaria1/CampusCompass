$(document).ready(function () {
  let responseData;
  let map;
  let geoJSONLayer;
  let locationEntranceData = "/locations/getAllEntrances";

  $("#form-search").submit(function (event) {
    event.preventDefault();
  });

  getData(locationEntranceData);

  function getData(endpoint) {
    $.ajax({
      url: endpoint,
      success: function (response) {
        responseData = response;
        bindChangeRender(response);
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.responseJSON);
        console.log(textStatus);
        console.log(error);
        window.alert("Failed to fetch data");
        location.reload();
      },
    });
  }

  function bindChangeRender(rawResponse) {
    let response = rawResponse.data;
    if (response) $("#results").removeAttr("hidden");
    if (!map) {
      map = L.map("map").setView([40.744707, -74.025638], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 19,
      }).addTo(map);
    }
    renderData(response, map);
    renderAdditionalFilter(rawResponse.uniqueTypes, "#search-type");

    let filteredResponseList = [];
    $(".form-input").on("input", function () {
      let serachString = $("#search-string").val().trim().toLowerCase();
      let searchType = $("#search-type").val();
      let accessibleType = $("#search-type-accessible").val();

      if (
        searchType !== "#" ||
        accessibleType !== "#" ||
        serachString.length > 0
      ) {
        filteredResponseList = filterResponse(
          response,
          searchType,
          serachString,
          accessibleType
        );

        filteredResponseList.length > 0
          ? renderData(filteredResponseList, map)
          : renderData(response, map);
        filteredResponseList = [];
      } else {
        renderData(response, map);
      }
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

  function filterResponse(
    responseData,
    filterValue,
    searchValue,
    accessibleType
  ) {
    if (accessibleType !== "#") {
      responseData = responseData.filter(
        (elm) => elm.accessible === accessibleType
      );
    }
    if (filterValue !== "#")
      responseData = responseData.filter((elm) => elm.type === filterValue);
    if (searchValue && searchValue.length > 0)
      responseData = responseData.filter(
        (elm) => elm["name"].toLowerCase().indexOf(searchValue) > -1
      );
    return responseData;
  }

  function renderData(response, map) {
    $("#results-location").empty();

    if (response.length === 0) {
      $("#results").html(`<p>No Records to Display</p>`);
    } else {
      let geoObject = {
        type: "FeatureCollection",
        features: [],
      };
      if (geoJSONLayer) {
        map.removeLayer(geoJSONLayer);
      }

      response.map((data) => {
        data.location.properties = { popupContent: `${data.name}` };
        geoObject.features.push(data.location);
        for (let entrace of data.entrances) {
          entrace.location.properties = {
            popupContent:
              entrace.accessible === "Y" ? "Accessible: Yes" : "Accessible: No",
            accessible: entrace.accessible,
          };
          geoObject.features.push(entrace.location);
        }

        let accessibleString = "No";
        for (let entrance of data.entrances) {
          if (entrance.accessible === "Y") accessibleString = "Yes";
        }
        const div = `
      <div class="cards">
        <h2>
          <a href="#" data-id="${data._id}" >${data.name}</a>
        </h2>
        <p>Type: ${data.type}</p>
        <p>Accessible Entrances: ${accessibleString}</p>
      </div>`;
        $("#results-location").append(div);
      });

      geoJSONLayer = L.geoJSON([geoObject], {
        pointToLayer: function (feature, latlng) {
          var accessible = L.icon({
            iconUrl: "/public/img/accessible.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          var notaccessible = L.icon({
            iconUrl: "/public/img/door-open.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          if (feature.properties.accessible) {
            var icon =
              feature.properties.accessible === "Y"
                ? accessible
                : notaccessible;
          }
          return L.marker(latlng, { icon: icon });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<p>" + feature.properties.popupContent + "</p>");
        },
      }).addTo(map);

      if (geoJSONLayer) {
        $("#clear").removeAttr("hidden");
      } else {
        $("#clear").attr("hidden", true);
      }

      map.fitBounds(geoJSONLayer.getBounds());
    }
  }

  $("#clear").on("click", () => {
    if (geoJSONLayer) map.fitBounds(geoJSONLayer.getBounds());
    $("#search-type").val("#").trigger("input");
    $("#search-type-accessible").val("#").trigger("input");
    $("#search-string").val("").trigger("input");
  });

  $(".cards-container").on("click", "a", (e) => {
    e.preventDefault();
    let selectObject;

    for (let data of responseData.data) {
      if (data._id === e.target.dataset.id) {
        selectObject = data;
        break;
      }
    }
    let geojsonBounds = L.geoJSON(selectObject.location).getBounds();
    map.fitBounds(geojsonBounds);
  });
});
