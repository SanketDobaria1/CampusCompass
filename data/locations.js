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

  async create(name, desc, type, operating_hours) {
    // ERROR HANDLING & INPUT VALIDATIONS //

    const date = new Date();
    date.setTime(date.getTime() + -240 * 60 * 1000);

    let newLocation = {
      name: name,
      desc: desc,
      type: type,
      operating_hours: operating_hours,
      rooms: [],
      location: [],
      entrances: [],
      lastupdatedDate: date.toISOString(),
    };

    const locationsCollection = await locations();
    const insertInfo = await locationsCollection.insertOne(newLocation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add Location";
    }

    const newId = insertInfo.insertedId.toString();
    const location = await this.getById(newId);
    return location;
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

  async update(id, name, desc, type, operating_hours) {
    // ERROR HANDLING & INPUT VALIDATIONS //


        const date = new Date()
        date.setTime(date.getTime() + (-240)*(60)*(1000))

        const updatedLocation = {
            name: name,
            desc: desc,
            type: type,
            operating_hours: operating_hours,
            lastupdatedDate: date.toISOString()
        };

    const locationsCollection = await locations();
    const location = await locationsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (location === null) throw "No location found with given Id";
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


    async remove(id){
        id = validation.checkId(id, 'LocationID');
        const locationsCollection = await locations();
        const deletionInfo = await locationsCollection.findOneAndDelete({ _id: new ObjectId(id)})
        if (deletionInfo.lastErrorObject.n === 0) { throw `Could not delete Location with given id` }
        return `'${deletionInfo.value.name}' has been successfully deleted!`;
  }
};

export default exportedMethods;