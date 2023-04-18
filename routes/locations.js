import { Router } from "express";
import { locationsData } from "../data/index.js";
import validation from "../validate.js";
import { locations } from "../config/mongoCollections.js";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const List = await locationsData.getAll();
      // res.json(List.map(({ _id, name }) => ({ _id, name })));
      res.render("pages/locations", { data: List, title: "Locations" });
    } catch (e) {
      res.status(404).send(e);
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
      data.name = validation.checkString(data.name, "Location Name");
      data.desc = validation.checkString(data.desc, "Description");
      data.type = validation.checkString(data.type, "Location Type");
      data.operating_hours = validation.checkStringArray(
        data.operating_hours,
        "Operating Hours"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { name, desc, type, operating_hours } = data;
      const newLocation = await locationsData.create(
        name,
        desc,
        type,
        operating_hours
      );
      res.json(newLocation);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const location = await locationsData.getById(req.params.id);
      res.render("pages/location", { title: "Location", data: location });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })

  .put(async (req, res) => {
    const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
      updatedData.name = validation.checkString(
        updatedData.name,
        "Location Name"
      );
      updatedData.desc = validation.checkString(
        updatedData.desc,
        "Description"
      );
      updatedData.type = validation.checkString(
        updatedData.type,
        "Location Type"
      );
      updatedData.operating_hours = validation.checkStringArray(
        updatedData.operating_hours,
        "Operating Hours"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { name, desc, type, operating_hours } = updatedData;
      const updatedLocation = await locationsData.update(
        req.params.id,
        name,
        desc,
        type,
        operating_hours
      );
      res.json(updatedLocation);
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
