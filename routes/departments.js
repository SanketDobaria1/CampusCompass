import { Router } from "express";
import { departmentData } from "../data/index.js";
import validations from "../validate.js";
import xss from "xss";

const router = Router();

router.route("/").get(async (req, res) => {
  if (xss(req.session.userID)) {
    res.render("pages/departments", { title: "department", logedin: true });
  } else {
    res.redirect("/");
  }
});

router.route("/getAll").get(async (req, res) => {
  let departmentResponse;
  if (xss(!req.session.userID)) {
    res.redirect("/");
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

router.route("/get/:id").get(async (req, res) => {
  let departmentID = req.params.id;
  try {
    departmentID = validations.checkId(departmentID);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let departmentObject = await departmentData.getById(departmentID);
    return res.json(departmentObject);
  } catch (err) {
    return res.status(400).json({ error: "No Department found" });
  }
});

export default router;
