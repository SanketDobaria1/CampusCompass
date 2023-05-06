import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import validation from "../validate.js";
import notifications from "../data/notification.js"


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

  async create(name, desc, type, hours, location_id) {
    // ERROR HANDLING & INPUT VALIDATIONS //
    name = validation.checkString(name, "event Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "event Type");
    hours = validation.checkStringArray(hours, "Hours", 2);
    const created_by = "adminId";
    // location_id = validation.checkId(location_id, "Location ID");

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    let newevent = {
      name: name,
      desc: desc,
      type: type,
      hours: hours,
      created_by: created_by,
      location_id: location_id,
      lastupdatedDate: date,
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

  async update(id, name, desc, type, hours, location_id) {
    // ERROR HANDLING & INPUT VALIDATIONS //
    id = validation.checkId(id, "eventID");
    name = validation.checkString(name, "event Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "event Type");
    hours = validation.checkStringArray(hours, "Hours");
    location_id = validation.checkId(location_id, "Location ID");

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    const updatedevent = {
      name: name,
      desc: desc,
      type: type,
      hours: hours,
      location_id: location_id,
      lastupdatedDate: date,
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
    if(event.name !== updatedInfo.value.name){
      notificationDetails = notificationDetails+` name from ${event.name} to ${updatedInfo.value.name}`;
    }
    else if(event.desc !== updatedInfo.value.desc){
      notificationDetails = notificationDetails+` description from ${event.desc} to ${updatedInfo.value.desc}`;
    }
    else if(event.type !== updatedInfo.value.type){
      notificationDetails = notificationDetails+` type from ${event.type} to ${updatedInfo.value.type}`;
    }
    else if(event.hours !== updatedInfo.value.hours){
      notificationDetails = notificationDetails+` hours from ${event.hours} to ${updatedInfo.value.hours}`;
    }
    else if(event.location_id !== updatedInfo.value.location_id){
      notificationDetails = notificationDetails+` location from ${event.location_id} to ${updatedInfo.value.location_id}`;
    }
    let newNotification = notifications.create(notificationTitle, notificationDesc, notificationDetails);
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
