import { Router } from "express";
import { locationsData, roomsData } from "../data/index.js";
import validation from "../validate.js";
import * as turf from "@turf/turf";
const router = Router();
import xss from "xss";

router.route("/getAllRecords").get(async (req, res) => {
  if (!req.xhr)
    if (
      req.headers["user-agent"] &&
      req.headers["user-agent"].includes("Mozilla")
    )
      return res.status(401).render("pages/error", {
        statusCode: 401,
        errorMessage: "Forbidden",
      });
    else return res.status(401).json({ error: "Forbidden" });
  let locationResponse = await locationsData.getLocationsAll();

  let uniqueTypes = [...new Set(locationResponse.map((obj) => obj.type))];

  return res.json({
    total_records: locationResponse.length,
    uniqueTypes,
    data: locationResponse,
  });
});

router.route("/getAllEntrances").get(async (req, res) => {
  if (!req.xhr)
    if (
      req.headers["user-agent"] &&
      req.headers["user-agent"].includes("Mozilla")
    )
      return res.status(401).render("pages/error", {
        statusCode: 401,
        errorMessage: "Forbidden",
      });
    else return res.status(401).json({ error: "Forbidden" });
  let locationResponse = await locationsData.getLocationEntrance();
  let uniqueTypes = [...new Set(locationResponse.map((obj) => obj.type))];

  return res.json({
    total_records: locationResponse.length,
    uniqueTypes,
    data: locationResponse,
  });
});

router.route("/entrance").get(async (req, res) => {
  return res.render("pages/BuildingEntrances", {
    title: "Entrances",
    logedin: "userID" in req.session && req.session.userID.length > 5,
  });
});

router
  .route("/")
  .get(async (req, res) => {
    if (req.query.key) {
      try {
        let isAdmin = false;
        if (req.session.userRole === "admin") {
          isAdmin = true;
        }
        const List = await locationsData.search(req.query.key);
        return res.render("pages/location/locations", {
          data: List,
          key: req.query.key,
          title: "Locations",
          logedin: "userID" in req.session && req.session.userID.length > 5,
          isAdmin: isAdmin,
        });
      } catch (e) {
        res.status(404).send(e);
      }
    } else {
      try {
        let isAdmin = false;
        if (req.session.userRole === "admin") {
          isAdmin = true;
        }
        const List = await locationsData.getAll();
        List.forEach((location) => {
          location.open = validation.formatTime(location.operating_hours[0]);
          location.close = validation.formatTime(location.operating_hours[1]);
        });
        return res.render("pages/location/locations", {
          data: List,
          title: "Locations",
          logedin: "userID" in req.session && req.session.userID.length > 5,
          isAdmin: isAdmin,
        });
      } catch (e) {
        res.status(404).send(e);
      }
    }
  })
  .post(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      data.location_name = validation.checkString(
        xss(data.location_name),
        "Location Name"
      );
      data.location_desc = validation.checkString(
        xss(data.location_desc),
        "Description"
      );
      data.location_type = validation.checkString(
        xss(data.location_type),
        "Location Type"
      );
      // data.operating_hours = JSON.parse(
      //   data.operating_hours.replace(/"/g, '"')
      // );
      let total_hours = [];
      total_hours.push(xss(data.opening_hours));
      total_hours.push(xss(data.closing_hours));
      total_hours = validation.checkStringArray(
        total_hours,
        "Operating Hours",
        2
      );

      data.operating_hours = total_hours;

      let coordinates = JSON.parse(xss(data.location).replace(/\s+/g, ""));
      validation.checkisPolygon(
        coordinates[0],
        "GeoJSON Coordinates of Location"
      );
      data.location = {
        type: "Polygon",
        coordinates: coordinates,
      };
      data.entrance_access = xss(data.entrance_access);
      let entrance = [];

      if (data.entrance_access.length > 1) {
        data.location_entrances = data.location_entrances.map((element) => {
          return JSON.parse(element.replace(/\s+/g, ""));
        });
        data.location_entrances.forEach((element, index) => {
          entrance.push({
            location: {
              coordinates: element,
              type: "Point",
            },
            accessible: data.entrance_access[index].toUpperCase(),
          });
        });
      } else if (data.entrance_access.length === 1) {
        entrance.push({
          location: {
            coordinates: JSON.parse(
              data.location_entrances.replace(/\s+/g, "")
            ),
            type: "Point",
          },
          accessible: data.entrance_access.toUpperCase(),
        });
      }

      // console.log(data.entrance_access);
      // console.log(data.location_entrances);
      // data.location = data.location;

      data.location_entrances = entrance;
    } catch (e) {
      return res.status(400).render("pages/location/createLocation", {
        data: req.body,
        error: e,
      });
    }
    try {
      const {
        location_name,
        location_desc,
        location_type,
        operating_hours,
        location,
        location_entrances,
      } = data;

      const newLocation = await locationsData.create(
        location_name,
        location_desc,
        location_type,
        operating_hours,
        location,
        location_entrances
      );
      return res.redirect("/locations");
    } catch (e) {
      return res.status(400).render("pages/location/createLocation", {
        data: req.body,
        error: e,
      });
    }
  });

router.route("/create").get(async (req, res) => {
  return res.render("pages/location/createLocation");
});

router
  .route("/edit/:id")
  .get(async (req, res) => {
    const location = await locationsData.getById(req.params.id);
    return res.render("pages/location/editLocation", { data: location });
  })
  .put(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");

      data.location_name = validation.checkString(
        xss(data.location_name),
        "Location Name"
      );

      data.location_desc = validation.checkString(
        xss(data.location_desc),
        "Description"
      );

      data.location_type = validation.checkString(
        xss(data.location_type),
        "Location Type"
      );

      let total_hours = [];
      total_hours.push(xss(data.opening_hours));
      total_hours.push(xss(data.closing_hours));
      total_hours = validation.checkStringArray(
        total_hours,
        "Operating Hours",
        2
      );
      data.operating_hours = total_hours;
      // data.location = data.location;
      // data.location_entrances = data.location_entrances;
    } catch (e) {
      return res.status(400).render("pages/location/editLocation", {
        data: req.body,
        error: e,
      });
    }

    try {
      const {
        location_name,
        location_desc,
        location_type,
        operating_hours,
        // location,
        // location_entrances,
      } = data;
      const updatedLocation = await locationsData.update(
        req.params.id,
        location_name,
        location_desc,
        location_type,
        operating_hours
        // location,
        // location_entrances
      );
      res.redirect("/locations");
    } catch (e) {
      return res.status(400).render("pages/location/editLocation", {
        data: req.body,
        error: e,
      });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let isAdmin = false;
    let accessibleString = "No";
    if (req.session.userRole === "admin") {
      isAdmin = true;
    }
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const location = await locationsData.getById(req.params.id);
      location.operating_hours = [
        validation.formatTime(location.operating_hours[0]),
        validation.formatTime(location.operating_hours[1]),
      ];
      const rooms = await roomsData.getAll(location._id);

      let location_geo = location.location;

      const tempPolygon = turf.polygon(location_geo.coordinates);

      const centerPoint = turf.centroid(tempPolygon).geometry.coordinates;
      const reversedArray = [...centerPoint].reverse();
      location_geo.properties = { popupContent: `${location.name}` };
      let entrances_geo = [];
      entrances_geo.push(location_geo);
      location.entrances.forEach((element) => {
        if (element.accessible === "Y") accessibleString = "Yes";
        entrances_geo.push({
          type: element.location.type,
          coordinates: element.location.coordinates,
          properties: {
            popupContent: `Accessible Entrance : ${accessibleString}`,
          },
        });
      });
      entrances_geo = {
        type: "FeatureCollection",
        features: entrances_geo,
      };
      // console.dir(entrances_geo, { depth: null });
      return res.render("pages/location/location", {
        title: "Location",
        data: location,
        rooms: rooms,
        accessibleEntrances: accessibleString,
        api_token: process.env.MAPBOX_TOKEN,
        geoObject: JSON.stringify(entrances_geo),
        centerPoint: reversedArray,
        isAdmin: isAdmin,
        logedin: "userID" in req.session && req.session.userID.length > 5,
      });
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  })
  .post(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      await locationsData.remove(req.params.id);
      res.redirect("/locations");
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })

  .delete(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await locationsData.remove(req.params.id);
      res.json({ LocationId: req.params.id, deteled: true });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

export default router;
