import { Router } from "express";
import departmentsdata from "../../CampusCompass/data/departments.js";
import eventdata from "../../CampusCompass/data/events.js";
import locationsdata from "../../CampusCompass/data/locations.js";
import { feedbackData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      let events = await eventdata.getAll();
      let departments = await departmentsdata.getDepartmentAll();
      let locations = await locationsdata.getAll();
      if (req.session.userRole == "admin") {
        res.render("pages/feedback", {
          admin: true,
          logedin: true,
          events: events,
          departments: departments,
          locations: locations,
        });
      } else {
        res.render("pages/feedback", {
          id: req.session.userID,
          logedin: true,
          events: events,
          departments: departments,
          locations: locations,
        });
      }
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
      data.reported_by = validation.checkId(data.reported_by, "user_id");
      data.reported_object = validation.checkId(
        data.reported_object,
        "event_id"
      );
      data.feedback_description = validation.checkString(
        data.feedback_description,
        "Description"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { reported_by, reported_object, feedback_description } = data;
      const newFeedback = await feedbackData.create(
        reported_by,
        reported_object,
        feedback_description
      );
      res.json(newFeedback);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

export default router;
