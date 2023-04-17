import loginRoutes from "./login.js";
import signupRoutes from "./signup.js";
import locationRoutes from "./locations.js";
import roomRoutes from "./rooms.js";
import departmentRoutes from "./departments.js";

const constructorMethod = (app) => {
  app.use("/signup", signupRoutes);
  app.use("/locations", locationRoutes);
  app.use("/rooms", roomRoutes);
  app.use("/departments", departmentRoutes);
  app.use("/", loginRoutes);
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
