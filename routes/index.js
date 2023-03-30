const constructorMethod = (app) => {
  app.use("/", (req, res) => {
    res.render("layouts/main");
  });

  app.use("/landing", (req, res) => {
    res.sendFile("maps/landing.html");
  });
  app.use("*", (req, res) => {
    res.status(404).json("404 : Not found");
  });
};

export default constructorMethod;
