import { ObjectId } from "mongodb";
import validation from "../validate.js";
import roomDataFunction from "./rooms.js";
import { departments } from "../config/mongoCollections.js";
const exportedMethods = {
  async create(depart_name, room_id, desc, type, operating_hours) {
    depart_name = validation.checkString(depart_name, "Department Name");
    room_id = validation.checkId(room_id, "Room ID");
    desc = validation.checkString(desc, "Department Description");
    type = validation.checkDepartmentType(type);
    operating_hours = validation.checkStringArray(
      operating_hours,
      "Operating Hours",
      2
    );
    validation.checkOperatingTimes(operating_hours[0], operating_hours[1]);
    //check if room_id exists
    // try {
    //   let dbRoom = await roomDataFunction.getById(room_id);
    //   if (!dbRoom) throw `Room doesnot exists for room_id:${room_id}`;
    // } catch (e) {
    //   throw e;
    // }

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
    let department = await this.getById(departmentInfo.insertedId.toString());
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

  async getDepartmentbyType(type) {
    type = validation.checkDepartmentType(type);
    const departmentCollection = await departments();
    const departmentList = await departmentCollection.find({ type }).toArray();
    departmentList.map((department) => {
      department._id = department._id.toString();
    });
    return departmentList;
  },

  async getDepartmentAll() {
    const departmentCollection = await departments();
    const departmentList = await departmentCollection.find({}).toArray();
    departmentList.map((department) => {
      department._id = department._id.toString();
    });
    return departmentList;
  },

  async getDepartmentPaginate(skipRecords, limitRecords) {
    if (
      typeof skipRecords !== "number" ||
      isNaN(skipRecords) ||
      skipRecords < 0
    )
      throw new Error(`Please Pass Proper parameters`);
    if (
      !limitRecords ||
      typeof limitRecords !== "number" ||
      isNaN(limitRecords) ||
      limitRecords <= 0
    )
      throw new Error(`Please Pass Proper parameters`);
    const departmentCollection = await departments();
    const departmentCount = await departmentCollection.count();
    const departmentList = await departmentCollection
      .find({})
      .skip(skipRecords)
      .limit(limitRecords)
      .toArray();
    departmentList.map((department) => {
      department._id = department._id.toString();
    });
    return { totalRecords: departmentCount, departments: departmentList };
  },
};

export default exportedMethods;
