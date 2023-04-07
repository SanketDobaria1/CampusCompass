import loginRoutes from "./login.js";
import signupRoutes from "./signup.js";

const constructorMethod = (app) => {
  app.use("/signup", signupRoutes);
  app.use("/", loginRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
