import { locationsDataFunction } from "../data/index.js";
import { closeConnection } from "../config/mongoConnection.js";

console.log(await locationsDataFunction.getAll());

await closeConnection();
