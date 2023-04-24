import {
  userData,
  departmentData,
  locationsData,
  roomsData,
} from "../data/index.js";
import { closeConnection } from "../config/mongoConnection.js";

async function main() {
  console.log("Begining Seed Script");
  // const admin = await userData.createUser(
  //   "test",
  //   "test@stevens.edu",
  //   "a123b123c123",
  //   "administrator"
  // );

  // const isssDepartment = await departmentData.create(
  //   "International Student and Scholar Services (ISSS)",
  //   "64236f804eebf566c9d8d8df",
  //   "The International Student and Scholar Services (ISSS) office is committed to assisting international students, faculty and scholars in accomplishing their academic, personal and professional objectives through advising, providing immigration services, promoting cross-cultural opportunities and offering specific programs and services to our international population.",
  //   "Administrative",
  //   ["08:00:00", "16:00:00"],
  //   [1, 2, 3, 4, 5]
  // );

  const library = await locationsData.create(
    "Samuel C Williams Library",
    "The Samuel C. Williams Library is the center for information discovery and preservation at Stevens Institute of Technology. The Library is dedicated to fostering an innovative environment with technology, education, and culture. It is our goal to create a distinctive library experience through services and resources that promote information and media literacy, knowledge creation, global scholarly communication, and critical and creative thinking for our students, faculty, and researchers around the world.",
    "Library",
    ["08:00:00", "23:59:59"]
  );

  const howeCenter = await locationsData.create(
    "Howe Center",
    "The Howe Center is situated at the top of the hill on Castle Point where the ancestral home of the Stevens family – Castle Stevens – once stood. Built in 1784 by Colonel John Stevens the Georgian-style mansion served, at times, as a dormitory, a cafeteria and office space.",
    "Administrative",
    ["08:00:00", "23:00:00"]
  );

  const athleticCenter = await locationsData.create(
    "Schaefer Athletic and Recreation Center",
    "All students must wear a mask at all times and practice social distancing. Students are encouraged to minimize the number of personal belongings brought into the facilities.",
    "Recreational",
    ["09:00:00", "20:00:00"]
  );

  const babioCenter = await locationsData.create(
    "Lawrence T. Babbio Jr. Center",
    "The Babbio Center is the home of the School of Business, and is where most business classes are held. The Babbio Center also is where Stevens’ high-tech financial analytics labs are located. The building commands an incredible view of the Manhattan skyline and has a variety of collaborative workspaces for students throughout. Faculty and leadership have offices on the upper floors of the Babbio Center, while parking is available in the attached garage.",
    "Multi-Purpose Building",
    ["07:00:00", "22:59:59"]
  );

  await roomsData.create(library._id.toString(), 101, 60, 1, "classroom");
  await roomsData.create(library._id.toString(), 102, 60, 1, "laboratory");
  await roomsData.create(library._id.toString(), 201, 120, 2, "laboratory");
  await roomsData.create(howeCenter._id.toString(), 101, 60, 1, "classroom");
  await roomsData.create(howeCenter._id.toString(), 102, 90, 1, "classroom");
  await roomsData.create(howeCenter._id.toString(), 103, 20, 1, "admin");
  await roomsData.create(babioCenter._id.toString(), 201, 60, 2, "classroom");
  await roomsData.create(babioCenter._id.toString(), 202, 30, 2, "laboratory");
  // const itSupport = await departmentData.create("IT SUPPORT");

  await closeConnection();
}
main();
