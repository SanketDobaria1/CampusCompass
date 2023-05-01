import departmentRoutes from "./departments.js";
import eventsRoutes from "./events.js";
import feedbackRoutes from "./feedback.js";
import locationRoutes from "./locations.js";
import loginRoutes from "./login.js";
import roomRoutes from "./rooms.js";
import searchRoutes from "./search.js";
import signupRoutes from "./signup.js";

const constructorMethod = (app) => {
  app.use("/signup", signupRoutes);
  app.use("/locations", locationRoutes);
  app.use("/rooms", roomRoutes);
  app.use("/departments", departmentRoutes);
  app.use("/events", eventsRoutes);
  app.use("/feedback", feedbackRoutes);
  app.use("/search", searchRoutes);
  app.use("/", loginRoutes);
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
