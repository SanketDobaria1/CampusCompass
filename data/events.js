import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import validation from "../validate.js";

const exportedMethods = {
  async getById(id) {
    id = validation.checkId(id, "eventID");
    const eventsCollection = await events();
    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (event === null) throw "No event found with that Id";
    event._id = event._id.toString();
    return event;
  },

  async create(name, desc, type, event_date, hours, created_by, location_id) {
    // ERROR HANDLING & INPUT VALIDATIONS //
    name = validation.checkString(name, "event Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "event Type");
    event_date = validation.checkStringArray(event_date, "event Date", 3);
    hours = validation.checkStringArray(hours, "Hours", 2);
    created_by = validation.checkId(created_by, "Created By");
    location_id = validation.checkId(location_id, "Location ID");

    const lastupdatedDate = new Date();
    lastupdatedDate.setTime(lastupdatedDate.getTime() + -240 * 60 * 1000);

    let newevent = {
      name: name,
      desc: desc,
      type: type,
      event_date: event_date,
      hours: hours,
      created_by: created_by,
      location_id: location_id,
      lastupdatedDate: lastupdatedDate,
    };

    const eventsCollection = await events();
    const insertInfo = await eventsCollection.insertOne(newevent);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add event";
    }

    const newId = insertInfo.insertedId.toString();
    const event = await this.getById(newId);
    return event;
  },

  async getAll() {
    const eventsCollection = await events();
    let eventsList = await eventsCollection.find({}).toArray();
    if (!eventsList) throw "Could not get all events";
    eventsList = eventsList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return eventsList;
  },

  async update(id, name, desc, type, event_date, hours, created_by, location_id) {
    // ERROR HANDLING & INPUT VALIDATIONS //
    id = validation.checkId(id, "eventID");
    name = validation.checkString(name, "event Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "event Type");
    event_date = validation.checkStringArray(event_date, "event Date", 3);
    hours = validation.checkStringArray(hours, "Hours", 2);
    created_by = validation.checkId(created_by, "Created By");
    location_id = validation.checkId(location_id, "Location ID");

    const lastupdatedDate = new Date();
    lastupdatedDate.setTime(lastupdatedDate.getTime() + -240 * 60 * 1000);

    const updatedevent = {
      name: name,
      desc: desc,
      type: type,
      event_date: event_date,
      hours: hours,
      created_by: created_by,
      location_id: location_id,
      lastupdatedDate: lastupdatedDate,
    };

    const eventsCollection = await events();
    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (event === null) throw "No event found with given Id";
    const updatedInfo = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedevent },
      { returnDocument: "after" }
    );
    if (updatedInfo.lastErrorObject.n === 0)
      throw "Could not update event successfully !";

    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
  },

  async remove(id) {
    id = validation.checkId(id, "eventID");
    const eventsCollection = await events();
    const deletionInfo = await eventsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete event with given id`;
    }
    return `'${deletionInfo.value.name}' has been successfully deleted!`;
  },
  async getEventsAll() {
    const eventCollection = await events();
    const eventList = await eventCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            name: 1,
            type: 1,
            hours: 1,
          },
        }
      )
      .toArray();
    eventList.map((event) => {
      event._id = event._id.toString();
    });
    return eventList;
  },
  async search(key) {
    const eventsCollection = await events();
    let eventsList = await eventsCollection
      .find({
        $or: [
          { name: { $regex: key, $options: "i" } },
          { type: { $regex: key, $options: "i" } },
        ],
      })
      .toArray();
    if (!eventsList) throw "Not Found";
    eventsList = eventsList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return eventsList;
  },
};

export default exportedMethods;
