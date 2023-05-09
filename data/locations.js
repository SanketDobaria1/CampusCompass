import { ObjectId } from "mongodb";
import { locations } from "../config/mongoCollections.js";
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
    type = validation.checkLocationType(type);

    // if (/^\d{2}:\d{2}:\d{2},\d{2}:\d{2}:\d{2}$/.test(operating_hours)) {
    //   throw `Provide operating hours in HH:MM:SS,HH:MM:SS format`;
    // }
    // operating_hours = operating_hours.split(",");
    // console.log(operating_hours);
    operating_hours = validation.checkStringArray(
      operating_hours,
      "Operating Hours",
      2
    );

    validation.checkOperatingTimes(operating_hours[0], operating_hours[1]);

    if (
      !location ||
      Object.keys(location).length !== 2 ||
      !location.hasOwnProperty("type") ||
      !location.hasOwnProperty("coordinates") ||
      location.type !== "Polygon"
    )
      throw new Error(`Missing Parameters in Location`);

    validation.checkisPolygon(location.coordinates[0], "Co-ordinates");

    if (!entrances || !Array.isArray(entrances) || entrances.length < 1)
      throw new Error(`Missing Entrances`);

    entrances.forEach((entrance) => {
      if (
        !entrance ||
        Object.keys(entrance).length !== 2 ||
        !entrance.hasOwnProperty("location") ||
        !entrance.hasOwnProperty("accessible") ||
        !entrance.location.hasOwnProperty("type") ||
        !entrance.location.hasOwnProperty("coordinates") ||
        entrance.location.type !== "Point"
      )
        throw new Error(`Missing Parameters in Entrances`);
      validation.checkisPointValid(
        entrance.location.coordinates,
        "Entrance Points"
      );
    });

    const locationsCollection = await locations();

    //check if object exists with same name
    let checkExistingLocation = await locationsCollection.findOne(
      {
        $or: [
          { name: name }, // Check for existing ID
          { location: { $geoIntersects: { $geometry: location } } }, // Check for existing location
          { location: { $geoWithin: { $geometry: location } } },
        ],
      },
      { projection: { _id: 1, name: 1 } }
    );
    if (checkExistingLocation)
      throw new Error(
        `There Already Exists an location with name ${checkExistingLocation.name} whose either name or co-ordinates are same `
      );

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
        $or: [
          { name: { $regex: key, $options: "i" } },
          { type: { $regex: key, $options: "i" } },
        ],
      })
      .toArray();
    if (!locationsList) throw "Not Found";
    locationsList = locationsList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return locationsList;
  },

  async update(id, name, desc, type, operating_hours) {
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

  async getLocationDropdown() {
    const locationCollection = await locations();
    const locationList = await locationCollection
      .find(
        {
          type: {
            $in: ["Residence", "Academic", "Administrative"],
          },
          "rooms.type": { $in: ["admin", "laboratory"] },
        },
        {
          projection: {
            _id: 1,
            name: 1,
            type: 1,
          },
        }
      )
      .toArray();

    return locationList;
  },

  async getLocationEntrance() {
    const locationCollection = await locations();

    const locationList = await locationCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            name: 1,
            type: 1,
            location: 1,
            entrances: 1,
          },
        }
      )
      .toArray();

    locationList.forEach((element) => {
      let accessible = "N";
      element._id = element._id.toString();
      for (let i = 0; i < element.entrances.length; i++) {
        if (element.entrances[i].accessible === "Y") {
          accessible = "Y";
          break;
        }
      }
      element.accessible = accessible;
    });

    return locationList;
  },
};

export default exportedMethods;
