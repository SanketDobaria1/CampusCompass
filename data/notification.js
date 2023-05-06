import { ObjectId } from "mongodb";
import { notifications } from "../config/mongoCollections.js";
import validation from "../validate.js";

const exportedMethods = {
  async getById(id) {
    id = validation.checkId(id, "Notification Id");
    const notificationCollection = await notifications();
    const notificationInfo = await notificationCollection.findOne({
      _id: new ObjectId(id),
    });
    if (notificationInfo === null) throw "No notification element found with that Id";
    notificationInfo._id = notificationInfo._id.toString();
    return notificationInfo;
  },

  async create(title, event_type, details) {
    title = validation.checkString(title, "Title");
    event_type = validation.checkString(event_type, "event_type");
    details = validation.checkString(details, "details");

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    let newNotification = {
      title: title,
      event_type: event_type,
      details: details,
      lastupdatedDate: date.toISOString(),
    };

    const notificationCollection = await notifications();
    const insertInfo = await notificationCollection.insertOne(newNotification);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add Notification";
    }

    const newId = insertInfo.insertedId.toString();
    const notificationinfo = await this.getById(newId);
    return notificationinfo;
  },

  async getAll() {
    const notificationCollection = await notifications();
    let notificationList = await notificationCollection.find({}).toArray();
    if (!notificationList) throw "Could not get notifications";
    notificationList = notificationList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return notificationList;
  },
};

export default exportedMethods;
