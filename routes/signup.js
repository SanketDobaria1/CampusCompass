import { Router } from "express";
import xss from "xss";
import { userData } from "../data/index.js";
import validations from "../validate.js";
const router = Router();

router.get("/", async (req, res) => {
  if (xss(req.session.userID)) res.redirect("/");
  else res.render("pages/signup", { title: "Sign Up" });
});

router.post("/", async (req, res) => {
  let user_name = req.body.user_name;
  let user_email = req.body.user_email;
  let user_password = req.body.user_password;

  try {
    user_name = validations.checkString(req.body.user_name, "Username");
    user_email = validations.checkStevensMail(req.body.user_email);
    user_password = validations.checkPassword(req.body.user_password);
  } catch (e) {
    return res.status(400).render("pages/signup", {
      title: "Sign Up",
      error_msg: e,
      user_name,
      user_email,
    });
  }
  if (await userData.checkIfEmailExists(user_email))
    return res.status(400).render("pages/signup", {
      title: "Sign Up",
      error_msg: "User Already Exists in System",
      user_name,
      user_email,
      user_exist: true,
    });
  let userCreated;
  try {
    userCreated = await userData.createUser(
      user_name,
      user_email,
      user_password
    );
    if (userCreated)
      return res.render("pages/signup", {
        title: "Sign Up",
        user_name,
        user_email,
        user_created: true,
      });
  } catch (e) {
    return res.status(500).render("pages/signup", {
      title: "Signup",
      error_msg: e,
    });
  }
});

export default router;
