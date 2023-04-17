import { userData } from "../data/index.js";

import { closeConnection } from "../config/mongoConnection.js";

console.log(
  //   await userData.createUser(
  //     "test",
  //     "test@stevens.edu",
  //     "a123b123c123",
  //     "administrator"
  //   )
  //   await userData.checkUser("test@stevens.edu", "a123b123c123")
  await userData.getRegisteredEventsID("64236d854eebf566c9d8d8da")
);

await closeConnection();
