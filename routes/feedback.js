import { Router } from "express";
import xss from "xss";

import {
  feedbackData,
  eventsData,
  locationsData,
  departmentData,
} from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    if (xss(!req.session.userID)) {
      return res.redirect("/");
    }
    try {
      let events = await eventsData.getAll();
      let departments = await departmentData.getDepartmentAll();
      let locations = await locationsData.getAll();
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
      res.render("pages/feedback", { success: true, logedin: true });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

router.route("/getAll").get(async (req, res) => {
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
  try {
    if (req.session.userRole == "admin") {
      res.render("pages/allfeedbacks", {
        admin: true,
        logedin: true,
      });
    } else {
      res.status(404).send(e);
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

router.route("/:id").get(async (req, res) => {
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
  try {
    if (req.session.userRole == "admin") {
      res.render("pages/feedbackID", {
        admin: true,
        logedin: true,
      });
    } else {
      res.status(404).send(e);
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

export default router;
