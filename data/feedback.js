import { ObjectId } from "mongodb";
import {
  departments,
  events,
  feedback,
  locations,
  users,
} from "../config/mongoCollections.js";
import validation from "../validate.js";

const exportedMethods = {
  async getById(id) {
    id = validation.checkId(id, "FeedbackId");
    const feedbackCollection = await feedback();
    const userCollection = await users();
    const departmentCollection = await departments();
    const locationCollection = await locations();
    const eventsCollection = await events();
    const feedbackinfo = await feedbackCollection.findOne({
      _id: new ObjectId(id),
    });
    if (feedbackinfo === null) throw "No feedback element found with that Id";
    let reported_object = new ObjectId(feedbackinfo.reported_object);
    if (feedbackinfo.reported_object_type === "departments")
      feedbackinfo.reported_object_details = await departmentCollection.findOne(
        { _id: reported_object },
        {
          projection: { _id: 1, name: 1 },
        }
      );

    if (feedbackinfo.reported_object_type === "events")
      feedbackinfo.reported_object_details = await eventsCollection.findOne(
        { _id: reported_object },
        {
          projection: { _id: 1, name: 1 },
        }
      );

    if (feedbackinfo.reported_object_type === "locations")
      feedbackinfo.reported_object_details = await locationCollection.findOne(
        { _id: reported_object },
        {
          projection: { _id: 1, name: 1 },
        }
      );

    const userinfo = await userCollection.findOne({
      _id: new ObjectId(feedbackinfo.reportedby),
    });
    feedbackinfo._id = feedbackinfo._id.toString();
    feedbackinfo.username = userinfo.name;
    return feedbackinfo;
  },

  async create(reportedby, reported_object, reportedObjectType, desc) {
    let objectTypeList = ["departments", "events", "locations"];
    desc = validation.checkString(desc, "Description");
    reportedby = validation.checkId(reportedby, "user_id");
    reported_object = validation.checkId(reported_object, "event_id");

    if (!objectTypeList.includes(reportedObjectType.trim().toLowerCase()))
      throw new Error(`Invalid Object Type`);
    const feedbackCollection = await feedback();
    const existingFeedback = await feedbackCollection.findOne({
      reportedby: reportedby,
      reported_object: reported_object,
    });
    if (existingFeedback)
      throw new Error(
        `Feedback has been already Provided. Please wait for admin to take actions against it`
      );
    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    let newFeedback = {
      reportedby: reportedby,
      reported_object: reported_object,
      reported_object_type: reportedObjectType,
      desc: desc,
      lastupdatedDate: date.toISOString(),
    };

    const insertInfo = await feedbackCollection.insertOne(newFeedback);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Could not add Feedback");
    }

    return { feedbackCreated: true };
  },

  async getAll() {
    const feedbackCollection = await feedback();

    let feedbackList = await feedbackCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();
    if (!feedbackList) throw "Could not get feedback";

    for (let i = 0; i < feedbackList.length; i++) {
      feedbackList[i]._id = feedbackList[i]._id.toString();
      feedbackList[i].reported_object_details = await this.getById(
        feedbackList[i]._id
      );
    }

    return feedbackList;
  },

  async remove(id) {
    id = validation.checkId(id, "Feedback ID");
    const feedbackCollection = await feedback();
    const deletionInfo = await feedbackCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not resolve Feedback with given id`;
    }
    return `'${deletionInfo.value.name}' has been successfully resolved!`;
  },
};

export default exportedMethods;
