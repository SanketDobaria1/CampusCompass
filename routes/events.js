import { Router } from "express";
import { eventsData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const List = await eventsData.getAll();
      res.render("pages/events", { data: List, title: "Events" });
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
      data.name = validation.checkString(data.name, "event Name");
      data.desc = validation.checkString(data.desc, "Description");
      data.type = validation.checkString(data.type, "event Type");
      data.hours = validation.checkStringArray(data.hours, "Hours");
      data.location_id = validation.checkId(data.location_id, "Location ID");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { name, desc, type, hours, location_id } = data;
      const newevent = await eventsData.create(
        name,
        desc,
        type,
        hours,
        location_id
      );
      res.json(newevent);
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
      const event = await eventsData.getById(req.params.id);
      res.render("pages/event", { title: "event", data: event });
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
      updatedData.name = validation.checkString(updatedData.name, "event Name");
      updatedData.desc = validation.checkString(
        updatedData.desc,
        "Description"
      );
      updatedData.type = validation.checkString(updatedData.type, "event Type");
      updatedData.hours = validation.checkStringArray(
        updatedData.hours,
        "Hours"
      );
      updatedData.location_id = validation.checkId(
        updatedData.location_id,
        "Location ID"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { name, desc, type, hours, location_id } = updatedData;
      const updatedevent = await eventsData.update(
        req.params.id,
        name,
        desc,
        type,
        hours,
        location_id
      );
      res.json(updatedevent);
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
      await eventsData.remove(req.params.id);
      res.json({ eventId: req.params.id, deteled: true });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

export default router;
