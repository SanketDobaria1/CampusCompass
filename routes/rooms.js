import { Router } from "express";
import xss from "xss";
import { locationsData, roomsData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router
  .route("/:id")
  .get(async (req, res) => {
    const location = await locationsData.getById(req.params.id);
    return res.render("pages/location/createRoom", { location: location });
  })
  .post(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
      data.room_number = JSON.parse(xss(data.room_number));
      data.capacity = JSON.parse(xss(data.capacity));
      data.floor_number = JSON.parse(xss(data.floor_number));

      if (typeof data.room_number !== "number")
        throw `Room number must be a Number !`;
      if (typeof data.capacity !== "number")
        throw `Room capacity must be a Number !`;
      if (typeof data.floor_number !== "number")
        throw `Floor number must be a Number !`;
      data.type = validation.checkString(xss(data.type), "Room Type");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { room_number, capacity, floor_number, type } = data;
      await roomsData.create(
        req.params.id,
        room_number,
        capacity,
        floor_number,
        type
      );
      res.redirect(`/locations/${req.params.id}`);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

router
  .route("/room/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const room = await roomsData.getById(req.params.id);
      res.json(room);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await roomsData.remove(req.params.id);
      res.redirect("/locations");
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

router.route("/getRoomsDropdown/:id").get(async (req, res) => {
  if (!req.xhr)
    if (
      req.headers["user-agent"] &&
      req.headers["user-agent"].includes("Mozilla")
    )
      return res.status(401).render("pages/error", {
        statusCode: 401,
        errorMessage: "Forbidden",
      });
    else return res.status(401).json({ error: "Forbidden" });
  let roomId;
  try {
    roomId = validation.checkId(req.params.id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  let roomsList = await roomsData.getRoomsDropdown(roomId);
  return res.json({ totalLength: roomsList.length, roomsData: roomsList });
});

export default router;
