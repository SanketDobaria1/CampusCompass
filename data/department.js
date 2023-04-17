import { ObjectId } from "mongodb";
import validation from "../validate.js";
import roomDataFunction from "./rooms.js";
import { departments } from "../config/mongoCollections.js";
const exportedMethods = {
  async create(depart_name, room_id, desc, type) {
    depart_name = validation.checkString(depart_name, "Department Name");
    room_id = validation.checkId(room_id, "Room ID");
    desc = validation.checkString(desc, "Department Description");
    type = validation.checkString(type, "Department Type");

    //check if room_id exists
    try {
      let dbRoom = await roomDataFunction.getById(room_id);
      if (!dbRoom) throw `Room doesnot exists for room_id:${room_id}`;
    } catch (e) {
      throw e;
    }

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);
    let newDeparment = {
      _id: new ObjectId(),
      name: depart_name,
      room_id,
      desc,
      type,
      lastupdatedDate: date,
    };
    const departmentCollection = await departments();
    let departmentInfo = await departmentCollection.insertOne(newDeparment);
    if (!departmentInfo.acknowledged || !departmentInfo.insertedId)
      throw new Error(`Could not create department`);
    let department = await this.getById(departmentInfo.insertedId);
    return department;
  },

  async getById(id) {
    id = validation.checkId(id, "Department ID");
    const departmentCollection = await departments();
    const department = await departmentCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!department) throw new Error(`No Department exists for ${id}`);
    department._id = department._id.toString();
    return department;
  },
  async getDepartmentbyType(type) {},
};

export default exportedMethods;
