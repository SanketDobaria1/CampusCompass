import { Router } from "express";
import xss from "xss";
import { eventsData, locationsData, userData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router.route("/getAllRecords").get(async (req, res) => {
  let eventResponse = await eventsData.getEventsAll();

  let uniqueTypes = [...new Set(eventResponse.map((obj) => obj.type))];

  return res.json({
    total_records: eventResponse.length,
    uniqueTypes,
    data: eventResponse,
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
        const List = await eventsData.search(req.query.key);
        res.render("pages/event/events", {
          data: List,
          key: req.query.key,
          title: "Events",
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
        const List = await eventsData.getAll();
        res.render("pages/event/events", {
          data: List,
          title: "Events",
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
      data.event_name = validation.checkString(
        xss(data.event_name),
        "event Name"
      );
      data.event_desc = validation.checkString(
        xss(data.event_desc),
        "Description"
      );
      data.event_type = validation.checkString(
        xss(data.event_type),
        "event Type"
      );
      data.event_start_date = validation.checkString(
        xss(data.event_start_date),
        "Event Start Date"
      );
      data.event_end_date = validation.checkString(
        xss(data.event_end_date),
        "Event End Date"
      );
      data.event_days = validation.checkDayArray(data.event_days, "Event days");

      let event_date = [];
      event_date.push(data.event_start_date);
      event_date.push(data.event_end_date);
      // TODO : set event_days
      // let days_string = xss(data.event_days).split(',').join('');
      // event_date.push(days_string);
      event_date.push("1");
      delete data.event_start_date;
      delete data.event_end_date;
      delete data.event_days;

      let hours = [];
      hours.push(xss(data.opening_hours));
      hours.push(xss(data.closing_hours));
      hours = validation.checkStringArray(hours, "Hours", 2);
      data.hours = hours;
      delete data.opening_hours;
      delete data.closing_hours;

      data.created_by = xss(req.session.userID);

      data.location_id = validation.checkId(data.location_id, "Location ID");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const {
        event_name,
        event_desc,
        event_type,
        event_date,
        hours,
        created_by,
        location_id,
      } = data;
      const newevent = await eventsData.create(
        event_name,
        event_desc,
        event_type,
        event_date,
        hours,
        created_by,
        location_id
      );
      // res.json(newevent);
      return res.redirect("/events");
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

// GET the form for creating a new event
router.get("/create", async (req, res) => {
  const locationList = await locationsData.getLocationsAll();
  res.render("pages/event/createEvent", {
    location: locationList,
    title: "Create Events",
    logedin: true,
  });
});

router
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const event = await eventsData.getById(req.params.id);
      res.render("pages/event/editEvent", {
        title: "Edit Event",
        data: event,
        logedin: true,
      });
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
      updatedData.event_name = validation.checkString(
        xss(updatedData.event_name),
        "event Name"
      );
      updatedData.event_desc = validation.checkString(
        xss(updatedData.event_desc),
        "Description"
      );
      updatedData.event_type = validation.checkString(
        xss(updatedData.event_type),
        "event Type"
      );
      updatedData.event_start_date = validation.checkString(
        xss(updatedData.event_start_date),
        "Event Start Date"
      );
      updatedData.event_end_date = validation.checkString(
        xss(updatedData.event_end_date),
        "Event End Date"
      );
      updatedData.event_days = validation.checkDayArray(
        xss(updatedData.event_days),
        "Event days"
      );

      let hours = [];
      hours.push(xss(updatedData.opening_hours));
      hours.push(xss(updatedData.closing_hours));
      updatedData.hours = hours;
      delete updatedData.opening_hours;
      delete updatedData.closing_hours;
      updatedData.hours = validation.checkStringArray(
        updatedData.hours,
        "Hours",
        2
      );

      updatedData.created_by = xss(req.session.userID);

      updatedData.location_id = validation.checkId(
        updatedData.location_id,
        "Location ID"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const {
        event_name,
        event_desc,
        event_type,
        event_date,
        hours,
        created_by,
        location_id,
      } = updatedData;
      const updatedevent = await eventsData.update(
        req.params.id,
        event_name,
        event_desc,
        event_type,
        event_date,
        hours,
        created_by,
        location_id
      );
      res.redirect(`/events/${req.params.id}`);
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
      const event = await eventsData.getById(req.params.id);
      event["formated_time_start"] = validation.formatTime(event.hours[0]);
      event["formated_time_end"] = validation.formatTime(event.hours[1]);
      res.render("pages/event/eventID", {
        title: "Event",
        data: event,
        isAdmin: isAdmin,
        logedin: true,
      });
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

router.route("/register/:id").post(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const registeredEvent = await userData.registerEvents(
      xss(req.session.userID),
      req.params.id
    );
    res.redirect("/events");
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export default router;
