import { Router } from "express";
import xss from "xss";
import { departmentData, locationsData } from "../data/index.js";
import validations from "../validate.js";

const router = Router();

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
  let departmentResponse = await departmentData.getDepartmentAll();
  let uniqueTypes = [...new Set(departmentResponse.map((obj) => obj.type))];
  return res.json({
    total_records: departmentResponse.length,
    uniqueTypes,
    data: departmentResponse,
  });
});

router.route("/getAll").get(async (req, res) => {
  let departmentResponse;
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
  let finalResponse = {};
  let pageSize = 20;
  let pageNumber;
  if (!req.query.page) pageNumber = 0;
  else pageNumber = req.query.page;
  try {
    pageNumber = Number(pageNumber);
  } catch (e) {
    finalResponse.error = `Expected page number to be Number`;
    return res.status(400).json(finalResponse);
  }

  let skipRecords = pageNumber <= 1 ? 0 : (pageNumber - 1) * pageSize;

  try {
    departmentResponse = await departmentData.getDepartmentPaginate(
      skipRecords,
      pageSize
    );
  } catch (error) {
    finalResponse.error = `Error Processing Data`;
    return res.status(500).json(finalResponse);
  }
  finalResponse.current_page = pageNumber;
  finalResponse.total_page = Math.ceil(
    departmentResponse.totalRecords / pageSize
  );
  finalResponse.total_records = departmentResponse.totalRecords;
  finalResponse.page_records_count = pageSize;
  if (req.session.userRole === "admin") finalResponse.admin = true;
  finalResponse.data = departmentResponse.departments;
  return res.json(finalResponse);
});

router
  .route("/")
  .get(async (req, res) => {
    res.render("pages/departments/departments", {
      title: "Departments",
      logedin: "userID" in req.session && req.session.userID.length > 5,
      admin: req.session.userRole === "admin",
    });
  })
  .post(async (req, res) => {
    let departmentName, room_id, desc, type, operating_hours, operating_days;
    try {
      departmentName = validations.checkString(
        xss(req.body.departmentName),
        "Department Name"
      );
      room_id = validations.checkId(xss(req.body.departmentRoomID), "Room Id");
      desc = validations.checkString(
        xss(req.body.departmentDesc),
        "Department Description"
      );
      type = validations.checkDepartmentType(xss(req.body.departmentType));
      operating_hours = [
        xss(req.body.departmentOpen),
        xss(req.body.departmentClose),
      ];
      validations.checkOperatingTimes(operating_hours[0], operating_hours[1]);
      operating_days = req.body.departmentWorkinDays;
      for (let i = 0; i < operating_days.length; i++) {
        operating_days[i] = Number(operating_days[i]);
      }

      operating_days = validations.checkDayArray(
        operating_days,
        "Operating Days"
      );
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      let departmentCreateInfo = await departmentData.create(
        departmentName,
        room_id,
        desc,
        type,
        operating_hours,
        operating_days
      );
      if (!departmentCreateInfo)
        return res.status(500).json({ error: "Error Creating object" });
      else return res.json({ departmentCreated: true });
    } catch (error) {
      if (error.message === "Department Already exists!")
        return res.status(400).json({ error: error.message });
      else return res.status(400).json({ error: error.message });
    }
  });

router.route("/create").get(async (req, res) => {
  const locationList = await locationsData.getLocationDropdown();
  return res.render("pages/departments/createdepartment", {
    logedin: "userID" in req.session && req.session.userID.length > 5,
    admin: req.session.userRole === "admin",
    title: "Department Create",
    form_type: "create",
    location: locationList,
  });
});

router
  .route("/edit/:id")
  .get(async (req, res) => {
    let departmentID = req.params.id;
    try {
      departmentID = validations.checkId(departmentID);
    } catch (e) {
      return res.status(400).render("pages/error", {
        title: "Error",
        statusCode: 400,
        errorMessage: "Not Found, Requested Page Doesnot exists!",
        logedin: "userID" in req.session && req.session.userID.length > 5,
      });
    }
    try {
      let department = await departmentData.getById(departmentID);
      department.departmentStart = department.operating_hours[0];
      department.departmentEnd = department.operating_hours[1];
      const locationList = await locationsData.getLocationDropdown();
      return res.render("pages/departments/createdepartment", {
        logedin: "userID" in req.session && req.session.userID.length > 5,
        admin: req.session.userRole === "admin",
        title: "Department Edit",
        form_type: "edit",
        location: locationList,
        department: department,
      });
    } catch (e) {
      return res.status(404).render("pages/error", {
        title: "Error",
        statusCode: 404,
        errorMessage: "Not Found, Requested Department Doesnot Exists!",
        logedin: "userID" in req.session && req.session.userID.length > 5,
      });
    }
  })
  .put(async (req, res) => {
    let departmentID = req.params.id;
    if (!req.xhr)
      if (
        req.headers["user-agent"] &&
        req.headers["user-agent"].includes("Mozilla")
      )
        return res.status(403).render("pages/error", {
          statusCode: 403,
          errorMessage: "Forbidden",
        });
    try {
      departmentID = validations.checkId(departmentID);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    let departmentName, room_id, desc, type, operating_hours, operating_days;
    try {
      departmentName = validations.checkString(
        xss(req.body.departmentName),
        "Department Name"
      );
      room_id = validations.checkId(xss(req.body.departmentRoomID), "Room Id");
      desc = validations.checkString(
        xss(req.body.departmentDesc),
        "Department Description"
      );
      type = validations.checkDepartmentType(xss(req.body.departmentType));

      operating_hours = [
        xss(req.body.departmentOpen),
        xss(req.body.departmentClose),
      ];
      validations.checkOperatingTimes(operating_hours[0], operating_hours[1]);
      operating_days = req.body.departmentWorkinDays;
      for (let i = 0; i < operating_days.length; i++) {
        operating_days[i] = Number(operating_days[i]);
      }

      operating_days = validations.checkDayArray(
        operating_days,
        "Operating Days"
      );
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      let departmentCreateInfo = await departmentData.updateDepartment(
        departmentID,
        departmentName,
        room_id,
        desc,
        type,
        operating_hours,
        operating_days
      );
      if (!departmentCreateInfo)
        return res.status(500).json({ error: "Error Creating object" });
      else return res.json({ departmentEdited: true });
    } catch (error) {
      if (error.message === "Department Already exists!")
        return res.status(400).json({ error: error.message });
      else return res.status(400).json({ error: error.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let departmentID = req.params.id;
    try {
      departmentID = validations.checkId(departmentID);
    } catch (e) {
      return res.status(404).render("pages/error", {
        title: "Error",
        statusCode: 404,
        errorMessage: "Not Found, Requested Department Doesnot Exists!",
        logedin: "userID" in req.session && req.session.userID.length > 5,
      });
    }
    try {
      let departmentObject = await departmentData.getById(departmentID);
      departmentObject["formated_time_start"] = validations.formatTime(
        departmentObject.operating_hours[0]
      );
      departmentObject["formated_time_end"] = validations.formatTime(
        departmentObject.operating_hours[1]
      );

      let operating_days = departmentObject.operating_days.map((day) =>
        validations.returnDay(day)
      );
      departmentObject.operating_days_str = operating_days.join(", ");
      return res.render("pages/departments/departmentID", {
        title: departmentObject.name,
        logedin: "userID" in req.session && req.session.userID.length > 5,
        data: departmentObject,
      });
    } catch (err) {
      return res.status(400).render("pages/error", {
        title: "Error",
        statusCode: 404,
        errorMessage: "Not Found, Requested Department Doesnot Exists!",
        logedin: "userID" in req.session && req.session.userID.length > 5,
      });
    }
  })
  .delete(async (req, res) => {
    if (!req.xhr)
      if (
        req.headers["user-agent"] &&
        req.headers["user-agent"].includes("Mozilla")
      )
        return res.status(403).render("pages/error", {
          statusCode: 403,
          errorMessage: "Forbidden",
        });
      else return res.status(401).json({ error: "Forbidden" });
    let departmentID = req.params.id;
    try {
      departmentID = validations.checkId(departmentID);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      let deleteObj = await departmentData.deleteDepartment(departmentID);
      if (deleteObj.deleted)
        return res.json({ id: departmentID, deleted: true });
      else return res.json(500).json({ id: departmentID, deleted: false });
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  });

export default router;
