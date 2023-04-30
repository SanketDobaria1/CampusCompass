import { Router } from "express";
import xss from "xss";
import { departmentData, locationsData } from "../data/index.js";
import validations from "../validate.js";

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    if (xss(req.session.userID)) {
      res.render("pages/departments", {
        title: "department",
        logedin: true,
        admin: req.session.userRole === "admin",
      });
    } else {
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    console.log(req);
    let departmentName, room_id, desc, type, operating_hours, operating_days;
    try {
      departmentName = validations.checkString(
        xss(req.body.departmentName),
        "Department Name"
      );
      room_id = validations.checkId(xss(req.body.room_id), "Room Id");
      desc = validations.checkString(xss(req.body.desc));
      type = validations.checkString(xss(req.body.departmenttype));
      operating_hours = [
        validations.checkOperatingTimes(xss(req.body.departmentOpen)),
        validations.checkOperatingTimes(xss(req.body.departmentClose)),
      ];
    } catch (error) {}
  });

router.route("/create").get(async (req, res) => {
  const locationList = await locationsData.getLocationDropdown();
  return res.render("pages/createdepartment", {
    title: "Department Create",
    location: locationList,
  });
});
router.route("/getAllRecords").get(async (req, res) => {
  let departmentResponse = await departmentData.getDepartmentAll();
  let uniqueTypes = [
    ...new Set(departmentResponse.map((obj) => obj.type.trim())),
  ];

  return res.json({
    total_records: departmentResponse.length,
    uniqueTypes,
    data: departmentResponse,
  });
});

router.route("/getAll").get(async (req, res) => {
  let departmentResponse;
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
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
    //console.log(error);
    return res.status(500).json(finalResponse);
  }
  finalResponse.current_page = pageNumber;
  finalResponse.total_page = Math.ceil(
    departmentResponse.totalRecords / pageSize
  );
  finalResponse.total_records = departmentResponse.totalRecords;
  finalResponse.page_records_count = pageSize;
  finalResponse.data = departmentResponse.departments;
  return res.json(finalResponse);
});

router.route("/:id").get(async (req, res) => {
  let departmentID = req.params.id;
  try {
    departmentID = validations.checkId(departmentID);
  } catch (e) {
    return res.status(400).json({ error: e });
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
    console.log(departmentObject);
    return res.render("pages/departmentID", {
      title: departmentObject.name,
      logedin: true,
      data: departmentObject,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "No Department found", error_msg: err });
  }
});

export default router;
