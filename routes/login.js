import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.render("pages/login", { title: "Login" });
});

export default router;
