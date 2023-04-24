import { Router } from "express";
import { feedbackData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router.route("/").post(async (req, res) => {
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  try {
    data.reportedby = validation.checkId(data.reportedby, "userID");
    data.reported_object = validation.checkId(data.reported_object, "event_id");
    data.desc = validation.checkString(data.desc, "Description");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const { reportedby, reported_object, desc } = data;
    const newFeedback = await feedbackData.create(
      reportedby,
      reported_object,
      desc
    );
    res.json(newFeedback);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export default router;
