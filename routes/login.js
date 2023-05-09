import { Router } from "express";
import xss from "xss";
import { userData } from "../data/index.js";
import validations from "../validate.js";
const router = Router();

router.get("/home", async (req, res) => {
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
  if (
    userRegisteredEvents &&
    userRegisteredEvents.hasOwnProperty("eventsData") &&
    userRegisteredEvents.eventsData.length > 0
  ) {
    displayString = "Your Upcoming Classes and Events";
    tempGeo = {
      type: "FeatureCollection",
      features: userRegisteredEvents.locationData,
    };
  } else {
    (displayString = "No Classes or Events for today"),
      (userRegisteredEvents = []);
  }

  return res.render("pages/landing", {
    title: "Landing",
    logedin: true,
    username: req.session.username,
    displayString,
    events: userRegisteredEvents.eventsData,
    renderMap: tempGeo?.features ? tempGeo.features.length > 0 : false ,
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
      return res.status(400).render("pages/login", {
        title: "Login",
        email: email,
        error_msg: e.message,
      });
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
      if (e.message === "connect ECONNREFUSED 127.0.0.1:27017")
        return res.status(500).render("pages/login", {
          title: "Login",
          email: email,
          error_msg: "Database Server is down! Please try again after sometime",
        });
      return res.status(400).render("pages/login", {
        title: "Login",
        email: email,
        error_msg: e.message,
      });
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
      return res.status(400).render("pages/login", {
        title: "Login",
        error_msg: e.message,
        email: email,
      });
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
