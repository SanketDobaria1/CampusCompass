import loginRoutes from "./login.js";
import signupRoutes from "./signup.js";
import locationRoutes from "./locations.js";
import roomRoutes from "./rooms.js";
import departmentRoutes from "./departments.js";
import eventsRoutes from "./events.js";
import feedbackRoutes from "./feedback.js";
import searchRoutes from "./search.js";

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
    return res.status(404).json({ error: "Accessing invalid path" });
  });
};

export default constructorMethod;
