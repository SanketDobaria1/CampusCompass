import loginRoutes from "./login.js";
import signupRoutes from "./signup.js";
import locationRoutes from './locations.js';
import roomRoutes from './rooms.js';
import feedbackRoutes from './rooms.js';


const constructorMethod = (app) => {
  app.use("/signup", signupRoutes);
  app.use('/locations', locationRoutes);
  app.use('/rooms', roomRoutes);
  app.use('/feedback', feedbackRoutes);
  app.use("/", loginRoutes);
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
