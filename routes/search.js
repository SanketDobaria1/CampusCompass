import { Router } from "express";
import { departmentData, locationsData, roomsData } from "../data/index.js";
import validations from "../validate.js";
import xss from "xss";

const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("pages/search", { title: "Search", logedin: true });
});

export default router;
