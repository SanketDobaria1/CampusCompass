import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import notifications from "../data/notification.js";
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

  async create(name, desc, type, event_date, hours, created_by, locations_arr) {
    // ERROR HANDLING & INPUT VALIDATIONS //
    name = validation.checkString(name, "event Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "event Type");
    event_date = validation.checkStringArray(event_date, "event Date", 3);
    hours = validation.checkStringArray(hours, "Hours", 2);
    created_by = validation.checkId(created_by, "Created By");

    if (
      typeof locations_arr !== "object" ||
      !Array.isArray(locations_arr) ||
      locations_arr.length < 1
    )
      throw new Error(`Expected Locations Array to contain atleast 1 element`);

    locations_arr[0] = validation.checkId(locations_arr[0], "Location ID");
    if (locations_arr.length === 2)
      locations_arr[1] = validation.checkId(locations_arr[1], "Building ID");

    let event_start = new Date(`${event_date[0]} 00:00:00`);
    let event_end = new Date(`${event_date[0]} 00:00:00`);

    if (!event_end >= event_start)
      throw new Error(`End Data cannot be less than start date`);
    else if (event_date[0] === event_date[1])
      event_date[2] = event_start.getDay();
    console.log(event_end === event_start, event_end.getDay());

    const lastupdatedDate = new Date();
    lastupdatedDate.setTime(lastupdatedDate.getTime() + -240 * 60 * 1000);

    let newevent = {
      name: name,
      desc: desc,
      type: type,
      event_date: event_date,
      hours: hours,
      created_by: created_by,
      location_id: locations_arr,
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

  async update(
    id,
    name,
    desc,
    type,
    event_date,
    hours,
    created_by,
    location_id
  ) {
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
    let notificationTitle = "Event update";
    let notificationDetails = `Updated the event ${event.name}`;
    let notificationDesc = `Updated the event ${event.name}`;
    if (event.name !== updatedInfo.value.name) {
      notificationDetails =
        notificationDetails +
        ` name from ${event.name} to ${updatedInfo.value.name}`;
    } else if (event.desc !== updatedInfo.value.desc) {
      notificationDetails =
        notificationDetails +
        ` description from ${event.desc} to ${updatedInfo.value.desc}`;
    } else if (event.type !== updatedInfo.value.type) {
      notificationDetails =
        notificationDetails +
        ` type from ${event.type} to ${updatedInfo.value.type}`;
    } else if (event.hours !== updatedInfo.value.hours) {
      notificationDetails =
        notificationDetails +
        ` hours from ${event.hours} to ${updatedInfo.value.hours}`;
    } else if (event.location_id !== updatedInfo.value.location_id) {
      notificationDetails =
        notificationDetails +
        ` location from ${event.location_id} to ${updatedInfo.value.location_id}`;
    }
    let newNotification = notifications.create(
      notificationTitle,
      notificationDesc,
      notificationDetails
    );
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
