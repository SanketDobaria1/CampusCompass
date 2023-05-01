import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("pages/search", { title: "Search", logedin: true });
});

export default router;
