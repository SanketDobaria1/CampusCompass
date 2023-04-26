import { locations } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../validate.js";

const exportedMethods = {
  async getById(id) {
    id = validation.checkId(id, "LocationID");
    const locationsCollection = await locations();
    const location = await locationsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (location === null) throw "No location found with that Id";
    location._id = location._id.toString();
    return location;
  },

  async create(name, desc, type, operating_hours, location, entrances) {
    name = validation.checkString(name, "Location Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "Location Type");
    operating_hours = validation.checkStringArray(
      operating_hours,
      "Operating Hours",
      2
    );

    validation.checkOperatingTimes(operating_hours[0], operating_hours[1]);

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    let newLocation = {
      name: name,
      desc: desc,
      type: type,
      operating_hours: operating_hours,
      rooms: [],
      location: location,
      entrances: entrances,
      lastupdatedDate: date.toISOString(),
    };

    const locationsCollection = await locations();
    const insertInfo = await locationsCollection.insertOne(newLocation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add Location";
    }

    const Location = await this.getById(insertInfo.insertedId.toString());
    return Location;
  },

  async getAll() {
    const locationsCollection = await locations();
    let locationsList = await locationsCollection.find({}).toArray();
    if (!locationsList) throw "Could not get all locations";
    locationsList = locationsList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return locationsList;
  },

  async search(key) {
    const locationsCollection = await locations();
    let locationsList = await locationsCollection
      .find({
        $or: [{ name: { $regex: key } }],
      })
      .toArray();
    if (!locationsList) throw "Not Found";
    locationsList = locationsList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return locationsList;
  },

  async update(id, name, desc, type, operating_hours, location, entrances) {
    // ERROR HANDLING & INPUT VALIDATIONS //
    id = validation.checkId(id, "LocationID");
    name = validation.checkString(name, "Location Name");
    desc = validation.checkString(desc, "Description");
    type = validation.checkString(type, "Location Type");
    operating_hours = validation.checkStringArray(
      operating_hours,
      "Operating Hours",
      2
    );

    validation.checkOperatingTimes(operating_hours[0], operating_hours[1]);

    const date = new Date();

    date.setTime(date.getTime() + -240 * 60 * 1000);

    const updatedLocation = {
      name: name,
      desc: desc,
      type: type,
      operating_hours: operating_hours,
      lastupdatedDate: date.toISOString(),
    };

    const locationsCollection = await locations();
    const Location = await locationsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (Location === null) throw "No location found with given Id";
    const updatedInfo = await locationsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedLocation },
      { returnDocument: "after" }
    );
    if (updatedInfo.lastErrorObject.n === 0)
      throw "Could not update Location successfully !";

    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
  },

  async remove(id) {
    id = validation.checkId(id, "LocationID");
    const locationsCollection = await locations();
    const deletionInfo = await locationsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete Location with given id`;
    }
    return `'${deletionInfo.value.name}' has been successfully deleted!`;
  },

  async getLocationsAll() {
    const locationCollection = await locations();
    const locationList = await locationCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            name: 1,
            type: 1,
            operating_hours: 1,
            operating_days: 1,
          },
        }
      )
      .toArray();
    locationList.map((location) => {
      location._id = location._id.toString();
    });
    return locationList;
  },
};

export default exportedMethods;
