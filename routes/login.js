import { Router } from "express";
import xss from "xss";
import { userData } from "../data/index.js";
import validations from "../validate.js";
const router = Router();

router.get("/home", async (req, res) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  let displayString = "";
  let userRegisteredEvents;
  try {
    userRegisteredEvents = await userData.getRegisteredEventsID(
      xss(req.session.userID)
    );
  } catch (error) {
    return res.json({ error: error.message });
  }
  let tempGeo;
  if (userRegisteredEvents.eventsData.length > 0) {
    displayString = "Your Upcoming Classes and Events";
    tempGeo = {
      type: "FeatureCollection",
      features: userRegisteredEvents.locationData,
    };
  } else displayString = "No Classes or Events for today";

  return res.render("pages/landing", {
    title: "Landing",
    logedin: true,
    username: req.session.username,
    displayString,
    events: userRegisteredEvents.eventsData,
    renderMap: userRegisteredEvents.locationData.length > 0,
    geoObject: JSON.stringify(tempGeo),
  });
});

router
  .route("/login")
  .get(async (req, res) => {
    res.render("pages/login", { title: "Login" });
  })
  .post(async (req, res) => {
    let email, password;
    try {
      email = validations.checkStevensMail(xss(req.body.login_email));
      password = validations.checkString(xss(req.body.login_password));
    } catch (e) {
      res
        .status(400)
        .render("pages/login", { title: "Login", error_msg: e.message });
    }

    try {
      let userExist = await userData.checkUser(email, password);
      if (userExist.userAuthenticated && userExist.userAuthenticated) {
        req.session.userID = userExist.userAuthenticatedID;
        req.session.username = userExist.username;
        req.session.userRole = userExist.userRole;
        return res.redirect("/home");
      }
    } catch (e) {
      res
        .status(400)
        .render("pages/login", { title: "Login", error_msg: e.message });
    }
    try {
      let userExist = await userData.checkUser(email, password);
      if (userExist.userAuthenticated && userExist.userAuthenticated) {
        req.session.userID = userExist.userAuthenticatedID;
        req.session.username = userExist.username;
        req.session.userRole = userExist.userRole;
        return res.redirect("/home");
      }
    } catch (e) {
      res
        .status(400)
        .render("pages/login", { title: "Login", error_msg: e.message });
    }
  });

router.get("/logout", async (req, res) => {
  // Clear the session cookie to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500);
      return res.render("pages/error", {
        statusCode: 500,
        errorMessage: "Internal Server Error",
      });
    } else {
      // Redirect the user to the home page
      res.redirect("/");
    }
  });
});

router.get("/", async (req, res) => {
  if (xss(req.session.userID)) res.redirect("/home");
  else {
    res.render("pages/login", { title: "Login" });
  }
});

export default router;
