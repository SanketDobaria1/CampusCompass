import { userData, departmentData } from "../data/index.js";

import { closeConnection } from "../config/mongoConnection.js";

// console.log(
//   //   await userData.createUser(
//   //     "test",
//   //     "test@stevens.edu",
//   //     "a123b123c123",
//   //     "administrator"
//   //   )
//   //   await userData.checkUser("test@stevens.edu", "a123b123c123")
//   // await userData.getRegisteredEventsID("64236d854eebf566c9d8d8da")

//   await departmentData.getDepartmentbyType("Administrative")
// );

await departmentData.create(
  "International Student and Scholar Services (ISSS)",
  "64236f804eebf566c9d8d8df",
  "The International Student and Scholar Services (ISSS) office is committed to assisting international students, faculty and scholars in accomplishing their academic, personal and professional objectives through advising, providing immigration services, promoting cross-cultural opportunities and offering specific programs and services to our international population.",
  "Administrative",
  ["08:00:00", "16:00:00"]
);

await closeConnection();
