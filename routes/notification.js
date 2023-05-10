import { Router } from "express";
import xss from "xss";
import { notificationsData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router.route("/").get(async (req, res) => {
  let isAdmin = false;
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
  if (req.session.userRole === "admin") {
    isAdmin = true;
  }
  try {
    let notificationList = await notificationsData.getAll();
    res.render("pages/notifications", {
      id: req.session.userID,
      title: "notifications",
      isAdmin: isAdmin,
      logedin: true,
      notifications: notificationList,
      username: req.session.username,
    });
  } catch (e) {
    res.status(404).send(e);
  }
});
router.route("/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "user ID");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  if (xss(!req.session.userID)) {
    return res.redirect("/");
  }
  try {
    const notificationbyID = await notificationsData.getById(req.params.id);
    res.render("pages/notificationID", {
      title: "notification",
      data: notificationbyID,
      logedin: true,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export default router;
