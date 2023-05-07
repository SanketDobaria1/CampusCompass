import { userData, departmentData, locationsData } from "../data/index.js";

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

// await departmentData.create(
//   "International Student and Scholar Services (ISSS)",
//   "64236f804eebf566c9d8d8df",
//   "The International Student and Scholar Services (ISSS) office is committed to assisting international students, faculty and scholars in accomplishing their academic, personal and professional objectives through advising, providing immigration services, promoting cross-cultural opportunities and offering specific programs and services to our international population.",
//   "Administrative",
//   ["08:00:00", "16:00:00"]
// );

let events = await userData.getRegisteredEventsID("642b9fa24a4bd39cfe07e17a");
//console.log(events);

const howeCenter = await locationsData.create(
  "Howe1 Center",
  "The Howe Center is situated at the top of the hill on Castle Point where the ancestral home of the Stevens family – Castle Stevens – once stood. Built in 1784 by Colonel John Stevens the Georgian-style mansion served, at times, as a dormitory, a cafeteria and office space.",
  "Administrative",
  ["08:00:00", "23:00:00"],
  {
    type: "Polygon",
    coordinates: [
      [
        [-74.02406347350265, 40.74507529485015],
        [-74.02410420475356, 40.74494456827472],
        [-74.02401346813976, 40.7449278345095],
        [-74.02411364675287, 40.744645743728256],
        [-74.02372204662885, 40.744579260608276],
        [-74.02364398707213, 40.7448639079806],
        [-74.02372401080272, 40.74487927842213],
        [-74.02367780014342, 40.74500480329371],
        [-74.02378577842126, 40.74502736098907],
        [-74.02377563456794, 40.745052124415196],
        [-74.0239502139303, 40.74508353526852],
        [-74.02396534673319, 40.745058097451846],
        [-74.02406347350265, 40.74507529485015],
      ],
    ],
  },
  [
    {
      location: {
        coordinates: [-74.02407940709723, 40.745025667321755],
        type: "Point",
      },
      accessible: "Y",
    },
    {
      location: {
        coordinates: [-74.0239075398253, 40.74459849354045],
        type: "Point",
      },
      accessible: "N",
    },
  ]
);
await closeConnection();
