import { users, events, locations } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import validations from "../validate.js";

const passwordEncryptRounds = 10;

const exportedMethods = {
  async createUser(name, emailid, password, department, role = "student") {
    let usersCollection = await users();
    name = validations.checkString(name, "User Name");
    emailid = validations.checkStevensMail(emailid);
    password = validations.checkString(password, "Password");
    department = validations.checkString(department, "Department");
    let hashpassword = await bcrypt.hash(password, passwordEncryptRounds);
    role = validations.checkString(role, "User Role");
    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    const checkIfUserExists = await usersCollection.findOne(
      { emailid },
      { projection: { _id: 1 } }
    );

    if (checkIfUserExists) throw new Error(`User already Exists in Database!`);
    let newUser = {
      role,
      emailid,
      name,
      department,
      hashedpassword: hashpassword,
      events: [],
      lastupdatedDate: date,
    };
    let userInsertedInfo = await usersCollection.insertOne(newUser);
    if (!userInsertedInfo.acknowledged || !userInsertedInfo.insertedId)
      throw new Error(`Could not Create User`);

    return {
      user_id: userInsertedInfo.insertedId.toString(),
      usercreated: true,
    };
  },

  async checkUser(emailid, password) {
    emailid = validations.checkStevensMail(emailid);
    password = validations.checkString(password);
    let usersCollection = await users();
    let dbUser = await usersCollection.findOne(
      { emailid },
      {
        projection: { _id: 1, name: 1, emailid: 1, hashedpassword: 1, role: 1 },
      }
    );
    if (!dbUser) throw new Error(`Either email or password is invalid`);

    if (!(await bcrypt.compare(password, dbUser.hashedpassword)))
      throw new Error(`Either email or password is invalid`);
    return {
      userAuthenticatedID: dbUser._id.toString(),
      userAuthenticated: true,
      username: dbUser.name,
      userRole: dbUser.role,
    };
  },
  async checkIfEmailExists(emailid) {
    emailid = validations.checkStevensMail(emailid);
    let usersCollection = await users();
    let dbUser = await usersCollection.findOne(
      { emailid },
      { projection: { _id: 1, emailid: 1, name: 1 } }
    );
    if (dbUser) return true;
    return false;
  },

  async getRegisteredEventsID(userid) {
    userid = validations.checkId(userid);
    let usersCollection = await users();
    let dbUser = await usersCollection.findOne(
      { _id: new ObjectId(userid) },
      { projection: { _id: 1, emailid: 1, events: 1 } }
    );
    if (!dbUser) throw new Error(`No User for UserID: ${userid}`);
    let eventList = dbUser.events;

    for (let i = 0; i < eventList.length; i++)
      eventList[i] = new ObjectId(eventList[i]);

    let eventCollection = await events();
    let locationCollection = await locations();
    const currentDate = new Date();
    const currentDateEst = new Date(currentDate.getTime() + -5 * 60 * 1000);
    let currentDay =
      currentDateEst.getDay() === 0 ? 7 : currentDateEst.getDay();

    let userEvents = await eventCollection
      .find(
        {
          _id: { $in: eventList },
          "event_date.1": { $gte: currentDateEst.toISOString().slice(0, 10) },
          "event_date.2": { $in: [0, currentDay, ((currentDay - 1) % 7) + 1] },
        },
        { projection: { desc: 0, lastupdatedDate: 0, created_by: 0 } }
      )
      .toArray();
    for (let i = 0; i < userEvents.length; i++) {
      let room_id, building_id;
      building_id = userEvents[i].location_id[0];
      if (userEvents[i].location_id.length == 2)
        room_id = userEvents[i].location_id[1];

      let location = await locationCollection.findOne(
        {
          _id: new ObjectId(building_id),
        },
        { projection: { _id: 1, name: 1, rooms: 1 } }
      );

      if (room_id) {
        location.rooms = location.rooms.filter((room) => {
          return room._id.toString() === room_id;
        });
        location.rooms = location.rooms[0];
      }
      userEvents[i]["Location_details"] = location;
      if (userEvents[i]["Location_details"])
        userEvents[i]["Location_details"]._id =
          userEvents[i]["Location_details"]._id.toString();
    }
    console.log(userEvents);

    return userEvents;
  },

  //needs more code
  async registerEvents(userid) {
    userid = validations.checkId(userid);
    let usersCollection = await users();
    let dbUser = await usersCollection.findOne(
      { _id: new ObjectId(userid) },
      { projection: { _id: 1, emailid: 1, events: 1 } }
    );
    if (!dbUser) throw new Error(`No User for UserID: ${userid}`);
  },
};

export default exportedMethods;
