import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();

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

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

app.use("/rooms/room/:id", async (req, res, next) => {
  if (req.method == "GET") {
    req.method = "DELETE";
  }
  next();
});

app.use("/locations/edit/:id", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "PUT";
  }
  next();
});

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(
  session({
    name: "AuthCookie",
    secret: "CampusCompass",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(loggingMiddleware);
// Use middleware functions for routes
app.get("/login", loginMiddleware);

app.get("/signup", registrationMiddleware);
app.get("/logout", logoutMiddleware);
app.use("/home", rootMiddleware);
app.use("/departments", rootMiddleware);
app.use("/events", rootMiddleware);
app.use("/locations", rootMiddleware);
app.use("/search", rootMiddleware);
app.use("/feedback", rootMiddleware);

app.use("/locations/create", adminMiddleware);
app.use("/locations/edit/:id", adminMiddleware);

app.delete("/locations", adminMiddleware);
app.delete("/departments/:id", adminMiddleware);

app.use("/departments/create", adminMiddleware);
app.use("/departments/edit/:id", adminMiddleware);

app.use("/events/create", adminMiddleware);
app.use("/events/edit/:id", adminMiddleware);
app.delete("/events/:id", adminMiddleware);
app.get("/events/:id", rootMiddleware);
app.get("/feedback/getAll", adminMiddleware);

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

exphbs
  .create({})
  .handlebars.registerHelper("if_eq", function if_eq(a, b, opts) {
    if (a === b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

exphbs
  .create({})
  .handlebars.registerHelper("if_in", function if_in(value, array, options) {
    if (array.indexOf(value) !== -1) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
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
