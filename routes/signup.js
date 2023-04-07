import { Router } from "express";
import xss from "xss";
const router = Router();

router.get("/", async (req, res) => {
  if (xss(req.session.userID)) res.redirect("/");
  else res.render("pages/signup", { title: "Sign Up" });
});

router.post("/", async (req, res) => {
  console.log(req.body);
});

export default router;
