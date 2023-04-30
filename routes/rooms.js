import { Router } from "express";
import { roomsData, locationsData } from "../data/index.js";
import validation from "../validate.js";
const router = Router();

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "Id URL Parameter");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const roomList = await roomsData.getAll(req.params.id);
      if (roomList.length === 0) {
        res.status(404).send("No Rooms found for this Location!");
      } else {
        res.json(roomList);
      }
    } catch (e) {
      res.status(404).send(e);
    }
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
      if (typeof data.room_number !== "number")
        throw `Room number must be a Number !`;
      if (typeof data.capacity !== "number")
        throw `Room capacity must be a Number !`;
      if (typeof data.floor_number !== "number")
        throw `Floor number must be a Number !`;
      data.type = validation.checkString(data.type, "Room Type");
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
      res.json(await locationsData.getById(req.params.id));
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
      res.json({ RoomId: req.params.id, deteled: true });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

router.route("/getRoomsDropdown/:id").get(async (req, res) => {
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
