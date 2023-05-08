import { ObjectId } from "mongodb";
import {
  feedback,
  locations,
  events,
  departments,
} from "../config/mongoCollections.js";
import validation from "../validate.js";

const exportedMethods = {
  async getById(id) {
    id = validation.checkId(id, "FeedbackId");
    const feedbackCollection = await feedback();
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

    feedbackinfo._id = feedbackinfo._id.toString();
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
    let feedbackList = await feedbackCollection.find({}).toArray();
    if (!feedbackList) throw "Could not get feedback";
    feedbackList = feedbackList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return feedbackList;
  },
};

export default exportedMethods;
