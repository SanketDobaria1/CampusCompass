import { Router } from "express";
import { locationsData } from "../data/index.js";
import { roomsData } from "../data/index.js";
import { userData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();
import xss from "xss";
import { compare } from "bcrypt";

router.route("/getAllRecords").get(async (req, res) => {
  let locationResponse = await locationsData.getLocationsAll();

  let uniqueTypes = [...new Set(locationResponse.map((obj) => obj.type))];

  return res.json({
    total_records: locationResponse.length,
    uniqueTypes,
    data: locationResponse,
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
      res.status(404).json({ error: e });
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
    if (req.session.userRole === "admin") {
      isAdmin = true;
    }
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const location = await locationsData.getById(req.params.id);
      const rooms = await roomsData.getAll(location._id);
      res.render("pages/location", {
        title: "Location",
        data: location,
        rooms: rooms,
        isAdmin: isAdmin,
        logedin: true,
      });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
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

//   router.route("/:key").get(async (req, res) => {
//   console.log("I dont know");
//   try {
//     let isAdmin = false;
//     if (req.session.userRole === "admin") {
//       isAdmin = true;
//     }
//     const List = await locationsData.find({
//       $or: [{ name: { $regex: req.params.key } }],
//     });

//     res.render("pages/locations", {
//       data: List,
//       title: "Locations",
//       logedin: true,
//       isAdmin: isAdmin,
//     });
//   } catch (e) {
//     res.status(404).send(e);
//   }
// });

export default router;
