import { userData } from "../data/index.js";

import { closeConnection } from "../config/mongoConnection.js";

console.log(
  await userData.createUser(
    "test",
    "test@stevens.edu",
    "a123b123c123",
    "administrator"
  )
);

await closeConnection();
