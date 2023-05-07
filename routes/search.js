import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("pages/search", {
    title: "Search",
    logedin: "userID" in req.session && req.session.userID.length > 5,
  });
});

export default router;
