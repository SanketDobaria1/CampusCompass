import { locations } from "../config/mongoCollections.js";
const locationsFunction = {
  async getAll() {
    let location_collection = await locations();
    let allLocations = await location_collection.find({}).toArray();
    return allLocations;
  },
};

export default locationsFunction;
