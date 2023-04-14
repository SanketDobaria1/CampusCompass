import { Router } from "express";
import xss from "xss";
import validations from "../validate.js";
import { userData } from "../data/index.js";
const router = Router();

router.get("/", async (req, res) => {
  if (xss(req.session.userID))
    res.render("pages/landing", { title: "Welcome", logedin: true });
  else {
    if (req.query.newusercreated)
      res.render("pages/login", { title: "Login", new_user_created: true });
    else res.render("pages/login", { title: "Login" });
  }
});

router.post("/login", async (req, res) => {
  let email, password;
  try {
    email = validations.checkStevensMail(xss(req.body.login_email));
    password = validations.checkString(xss(req.body.login_password));

    let userExist = await userData.checkUser(email, password);

    if (userExist.userAuthenticated && userExist.userAuthenticated) {
      req.session.userID = userExist.userAuthenticated;
      res.render("pages/landing", { title: "Welcome", logedin: true });
    }
  } catch (e) {
    res
      .status(400)
      .render("pages/login", { title: "Login", error_msg: e.message });
  }
});

router.get("/logout", async (req, res) => {
  if (xss(req.session.userID)) {
    req.session.destroy();
    // res.render("pages/logout", { title: "Loged out" });
    res.redirect("/");
  } else {
  }
});

export default router;
