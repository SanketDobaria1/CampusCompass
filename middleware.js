export const loginMiddleware = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect("/");
  }
  next();
};

export const logoutMiddleware = (req, res, next) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  next();
};

export const adminMiddleware = (req, res, next) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  console.log();
  if (req.session.userRole !== "admin") {
    res.status(403);
    return res.render("pages/error", {
      statusCode: 403,
      errorMessage: "You do not have permission to view this page.",
    });
  }
  next();
};

export const loggingMiddleware = (req, res, next) => {
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
      req.session.userID ? "Authenticated User" : "Non-Authenticated User"
    })`
  );
  next();
};

export const rootMiddleware = (req, res, next) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  next();
};

export const registrationMiddleware = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect("/home");
  }
  next();
};
