import { Router } from "express";
import { locationsData, roomsData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router.route("/getAllRecords").get(async (req, res) => {
  let locationResponse = await locationsData.getLocationsAll();

  let uniqueTypes = [...new Set(locationResponse.map((obj) => obj.type))];

  return res.json({
    total_records: locationResponse.length,
    uniqueTypes,
    data: locationResponse,
  });
});

router.route("/getAllEntrances").get(async (req, res) => {
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
    logedin: true,
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
        res.render("pages/locations", {
          data: List,
          key: req.query.key,
          title: "Locations",
          logedin: true,
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
        res.render("pages/locations", {
          data: List,
          title: "Locations",
          logedin: true,
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
        data.location_name,
        "Location Name"
      );
      data.location_desc = validation.checkString(
        data.location_desc,
        "Description"
      );
      data.location_type = validation.checkString(
        data.location_type,
        "Location Type"
      );
      // data.operating_hours = JSON.parse(
      //   data.operating_hours.replace(/"/g, '"')
      // );
      let total_hours = [];
      total_hours.push(data.opening_hours);
      total_hours.push(data.closing_hours);
      total_hours = validation.checkStringArray(
        total_hours,
        "Operating Hours",
        2
      );

      data.operating_hours = total_hours;

      let coordinates = JSON.parse(data.location.replace(/\s+/g, ""));
      validation.checkisPolygon(
        coordinates[0],
        "GeoJSON Coordinates of Location"
      );
      data.location = {
        type: "Polygon",
        coordinates: coordinates,
      };

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
      return res.status(400).json({ error: e.message });
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
      res.status(404).json({ error: e.message });
    }
  });

router.route("/create").get(async (req, res) => {
  return res.render("pages/createLocation");
});

router
  .route("/edit/:id")
  .get(async (req, res) => {
    const location = await locationsData.getById(req.params.id);
    return res.render("pages/editLocation", { data: location });
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
        data.location_name,
        "Location Name"
      );

      data.location_desc = validation.checkString(
        data.location_desc,
        "Description"
      );

      data.location_type = validation.checkString(
        data.location_type,
        "Location Type"
      );

      let total_hours = [];
      total_hours.push(data.opening_hours);
      total_hours.push(data.closing_hours);
      total_hours = validation.checkStringArray(
        total_hours,
        "Operating Hours",
        2
      );
      data.operating_hours = total_hours;
      data.location = data.location;
      data.location_entrances = data.location_entrances;
    } catch (e) {
      return res.status(400).json({ error: e });
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
      const updatedLocation = await locationsData.update(
        req.params.id,
        location_name,
        location_desc,
        location_type,
        operating_hours,
        location,
        location_entrances
      );
      res.redirect("/locations");
    } catch (e) {
      res.status(404).json({ error: e });
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
      res.render("pages/location", {
        title: "Location",
        data: location,
        rooms: rooms,
        accessibleEntrances: accessibleString,
        geoObject: JSON.stringify(entrances_geo),
        isAdmin: isAdmin,
        logedin: true,
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
