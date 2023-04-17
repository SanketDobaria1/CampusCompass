import { Router } from "express";
import { departmentData } from "../data/index.js";
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
  let allDepartments;
  try {
    allDepartments = await departmentData.getDepartmentAll();
  } catch (error) {
    return res.status(500).json({ error: "error" });
  }
  return res.json(allDepartments);
});

export default router;
