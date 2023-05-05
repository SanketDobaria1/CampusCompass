import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  adminMiddleware,
  loggingMiddleware,
  loginMiddleware,
  logoutMiddleware,
  registrationMiddleware,
  rootMiddleware,
} from "./middleware.js";
import configRoutes from "./routes/index.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

const port = 3000;

app.use("/locations/edit/:id", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "PUT";
  }
  next();
});

app.use("/departments/edit/:id", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "PUT";
  }
  next();
});

app.use("/events/edit/:id", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "PUT";
  }
  next();
});

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "AuthCookie",
    secret: "CampusCompass",
    resave: false,
    saveUninitialized: true,
  })
);

// Use middleware functions for routes
app.get("/login", loginMiddleware);
app.get("/signup", registrationMiddleware);
app.get("/logout", logoutMiddleware);
app.use("/locations/create", adminMiddleware);
app.use("/locations/edit/:id", adminMiddleware);
app.use("/departments/create", adminMiddleware);
app.use("/departments/edit/:id", adminMiddleware);
app.delete("/locations/:id", adminMiddleware);
app.use("/events/create", adminMiddleware);
app.use("/events/edit/:id", adminMiddleware);
app.delete("/events/:id", adminMiddleware);
app.get("/home", rootMiddleware);
app.use(loggingMiddleware);

///helper function for <select> tag
exphbs
  .create({})
  .handlebars.registerHelper("selected", function (value, option) {
    return value === option ? "selected" : "";
  });

///helper function for <select multiple> tag

exphbs
  .create({})
  .handlebars.registerHelper("selectarr", function (value, options) {
    if (!options) return "";
    return options.includes(Number(value)) ? "selected" : "";
  });

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    partialsDir: [path.join(__dirname + "/views/partials")],
  })
);

app.set("view engine", "handlebars");
configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
