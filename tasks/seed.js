import { userData } from "../data/index.js";

import { closeConnection } from "../config/mongoConnection.js";

async function main() {
  console.log("Begining Seed Script");
  const admin = await userData.createUser(
    "test",
    "test@stevens.edu",
    "a123b123c123",
    "administrator"
  );

  await closeConnection();
}
main();
