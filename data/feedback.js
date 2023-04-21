import { feedback } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../validate.js";

const exportedMethods = {
    async getById(id) {
      id = validation.checkId(id, "FeedbackId");
      const feedbackCollection = await feedback();
      const feedback = await feedbackCollection.findOne({
        _id: new ObjectId(id),
      });
      if (feedback === null) throw "No feedback element found with that Id";
      feedback._id = feedback._id.toString();
      return feedback;
    },
  
    async create(reportedby, reported_object, desc) {
      // ERROR HANDLING & INPUT VALIDATIONS //
      desc = validation.checkString(desc, 'Description')
      reportedby = validation.checkId(reportedby, 'user_id')
      reported_object = validation.checkId(reported_object, 'event_id')
  
      const date = new Date();
      date.setTime(date.getTime() + -240 * 60 * 1000);
  
      let newFeedback = {
        reportedby: reportedby,
        reported_object: reported_object,
        desc: desc,
        lastupdatedDate: date.toISOString(),
      };
  
      const feedbackCollection = await feedback();
      const insertInfo = await feedbackCollection.insertOne(newFeedback);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw "Could not add Feedback";
      }
  
      const newId = insertInfo.insertedId.toString();
      const feedback = await this.getById(newId);
      return feedback;
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
    }
  };
  
  export default exportedMethods;