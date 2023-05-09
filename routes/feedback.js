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
    let isAdmin = false;
    if (req.session.userRole === "admin") {
      isAdmin = true;
    }
    try {
      let events = await eventsData.getAll();
      let departments = await departmentData.getDepartmentAll();
      let locations = await locationsData.getAll();
      res.render("pages/feedback/feedback", {
        id: req.session.userID,
        isAdmin: isAdmin,
        logedin: "userID" in req.session && req.session.userID.length > 5,
        events: events,
        departments: departments,
        locations: locations,
        username: req.session.username,
      });
    } catch (e) {
      res.status(404).send(e);
    }
  })
  .post(async (req, res) => {
    let objectType, reported_object_id, feedbackDesc;
    let objectTypeList = ["departments", "events", "locations"];
    try {
      objectType = xss(req.body.objectType);
      if (!objectTypeList.includes(objectType.trim().toLowerCase()))
        throw new Error(`Invalid Object Type`);
      reported_object_id = validation.checkId(
        xss(req.body.reportedObject),
        "Reported Object ID"
      );
      feedbackDesc = validation.checkString(
        xss(req.body.feedbackDesc),
        "Description"
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const newFeedback = await feedbackData.create(
        req.session.userID,
        reported_object_id,
        objectType,
        feedbackDesc
      );

      if (newFeedback.feedbackCreated)
        return res.json({ feedbackCreated: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

router.route("/getAll").get(async (req, res) => {
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
  try {
    let feedbacks = await feedbackData.getAll();
    if (req.session.userRole == "admin") {
      res.render("pages/feedback/allfeedbacks", {
        admin: true,
        logedin: "userID" in req.session && req.session.userID.length > 5,
        feedbacks: feedbacks,
      });
    } else {
      res.status(404).send(e);
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

router.route("/:id")
.get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "user ID");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
  try {
    const feedbackbyID = await feedbackData.getById(req.params.id);
    res.render("pages/feedback/feedbackID", {
      title: "feedback",
      data: feedbackbyID,
      logedin: "userID" in req.session && req.session.userID.length > 5,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
})

.post(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    await feedbackData.remove(req.params.id);
    res.redirect("/feedback/getAll");
  } catch (e) {
    res.status(404).json({ error: e });
  }
})

export default router;
