import { ObjectId } from "mongodb";
import { locations } from "../config/mongoCollections.js";
import validation from "../validate.js";

const exportedMethods = {
  async getById(roomId) {
    roomId = validation.checkId(roomId, "RoomID");
    const locationsCollection = await locations();
    const locationsList = await locationsCollection.findOne(
      { "rooms._id": new ObjectId(roomId) },
      { projection: { _id: 0, "rooms.$": 1 } }
    );
    if (locationsList === null) throw "No Room found with that Id";
    locationsList.rooms[0]._id = locationsList.rooms[0]._id.toString();
    return locationsList.rooms[0];
  },

  async create(locationId, room_number, capacity, floor_number, type) {
    locationId = validation.checkId(locationId, "Location ID");
    room_number = validation.checkNumber(room_number, "Room_number");
    floor_number = validation.checkNumber(floor_number, "Floor_number");
    capacity = validation.checkNumber(capacity, "Capacity");
    type = validation.checkRoomType(type, "Room Type");

    const locationsCollection = await locations();
    const checkExistingLocation = await locationsCollection.findOne(
      {

      $and: [
        { "rooms.room_number": room_number },
        {"rooms.locationId": locationId}
      ],
      },

      { projection: { _id: 1, name: 1 } }
    );

    if (checkExistingLocation)
      throw new Error(`Rooms already exists for number`);

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);
    let newRoom = {
      _id: new ObjectId(),
      room_number: room_number,
      capacity: capacity,
      floor_number: floor_number,
      type: type,
    };
    const locationInfo = await locationsCollection.findOneAndUpdate(
      { _id: new ObjectId(locationId) },
      {
        $push: { rooms: newRoom },
        $set: { lastupdatedDate: date.toISOString() },
      },
      { returnDocument: "after" }
    );

    let newId = "";
    locationInfo.value.rooms.forEach((element) => {
      if (element._id.toString() === newRoom._id.toString()) {
        newId = element._id.toString();
      }
    });
    const room = await this.getById(newId);
    return room;
  },

  async getAll(locationId) {
    locationId = validation.checkId(locationId, "locationId");

    const locationsCollection = await locations();
    let location = await locationsCollection.findOne({
      _id: new ObjectId(locationId),
    });
    if (location === null) throw "No location found with that Id";
    let roomsList = await location.rooms;
    if (!roomsList) throw "Could not get all rooms";

    roomsList = roomsList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return roomsList;
  },

  async remove(roomId) {
    roomId = validation.checkId(roomId, "roomId");

    const locationsCollection = await locations();
    const locationsInfo = await locationsCollection.findOneAndUpdate(
      { "rooms._id": new ObjectId(roomId) },
      { $pull: { rooms: { _id: new ObjectId(roomId) } } },
      { returnDocument: "after" }
    );
    if (locationsInfo.lastErrorObject.n === 0)
      throw "Could not remove room successfully OR No room found with this ID!";

    return `Room with provided RoomId has been successfully deleted!`;
  },

  async getRoomsDropdown(locationID) {
    locationID = validation.checkId(locationID, "Location ID");
    let locationCollection = await locations();
    let roomsList;

    roomsList = await locationCollection.findOne(
      {
        _id: new ObjectId(locationID),
        "rooms.type": { $in: ["admin", "laboratory"] },
      },
      {
        projection: { _id: 1, "rooms._id": 1, "rooms.room_number": 1 },
      }
    );

    if (!roomsList)
      throw new Error(`No Location for Location ID : ${locationID}`);

    roomsList = roomsList.rooms;
    roomsList.forEach((room) => (room._id = room._id.toString()));
    return roomsList;
  },
};

export default exportedMethods;
