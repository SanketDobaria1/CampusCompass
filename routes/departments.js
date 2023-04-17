import { Router } from "express";
import { departmentData } from "../data/index.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const allDepartmments = await departmentData.ge;
});

router.route("/create").post(async (req, res) => {
  if (xss(req.session.userID && req.session.userRole.includes("Admin"))) {
  } else {
  }
});
