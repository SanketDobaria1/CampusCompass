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
  //   "administrator",
  //   "admin"
  // );

  // const isssDepartment = await departmentData.create(
  //   "International Student and Scholar Services (ISSS)",
  //   "64236f804eebf566c9d8d8df",
  //   "The International Student and Scholar Services (ISSS) office is committed to assisting international students, faculty and scholars in accomplishing their academic, personal and professional objectives through advising, providing immigration services, promoting cross-cultural opportunities and offering specific programs and services to our international population.",
  //   "Administrative",
  //   ["08:00:00", "16:00:00"],
  //   [1, 2, 3, 4, 5]
  // );

  // const library = await locationsData.create(
  //   "Samuel C Williams Library",
  //   "The Samuel C. Williams Library is the center for information discovery and preservation at Stevens Institute of Technology. The Library is dedicated to fostering an innovative environment with technology, education, and culture. It is our goal to create a distinctive library experience through services and resources that promote information and media literacy, knowledge creation, global scholarly communication, and critical and creative thinking for our students, faculty, and researchers around the world.",
  //   "Library",
  //   ["08:00:00", "23:00:00"],
  //   {
  //     type: "Polygon",
  //     coordinates: [
  //       [
  //         [-74.02546182494333, 40.74506705869908],
  //         [-74.02560283482114, 40.744579791007254],
  //         [-74.02521485991508, 40.744510582978734],
  //         [-74.0250598089466, 40.74499829604784],
  //         [-74.02546182494333, 40.74506705869908],
  //       ],
  //     ],
  //   },
  //   [
  //     {
  //       location: {
  //         coordinates: [-74.02517768966909, 40.74462860838662],
  //         type: "Point",
  //       },
  //       accessible: "N",
  //     },
  //     {
  //       location: {
  //         coordinates: [-74.02529033008382, 40.74452404375421],
  //         type: "Point",
  //       },
  //       accessible: "Y",
  //     },
  //   ]
  // );

  const howeCenter = await locationsData.create(
    "Howe Center",
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

  const babioCenter = await locationsData.create(
    "Lawrence T. Babbio Jr. Center",
    "The Babbio Center is the home of the School of Business, and is where most business classes are held. The Babbio Center also is where Stevens’ high-tech financial analytics labs are located. The building commands an incredible view of the Manhattan skyline and has a variety of collaborative workspaces for students throughout. Faculty and leadership have offices on the upper floors of the Babbio Center, while parking is available in the attached garage.",
    "Multi-Purpose Building",
    ["08:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02648926959405, 40.742954177668025],
          [-74.02650256701602, 40.742959213502786],
          [-74.0265347712054, 40.74296618961469],
          [-74.02658520953776, 40.74297226676512],
          [-74.02663219332761, 40.74297931223995],
          [-74.02669719174129, 40.74297826786636],
          [-74.02675543031066, 40.74296693214322],
          [-74.02676849232546, 40.74296006326176],
          [-74.02677554329222, 40.742954894866045],
          [-74.02691722336041, 40.742493886029195],
          [-74.02659249822541, 40.74243785952905],
          [-74.02653078033018, 40.74263221118608],
          [-74.02643543206403, 40.74261707264225],
          [-74.02634170100734, 40.742770273541936],
          [-74.02643458439883, 40.74280180411807],
          [-74.02643554582062, 40.74282490821162],
          [-74.02646804639065, 40.74282372978362],
          [-74.02646253782572, 40.742844392853584],
          [-74.02642456895816, 40.74285062137284],
          [-74.02643006961499, 40.74287240775104],
          [-74.02644522356508, 40.74290213230927],
          [-74.02643668136152, 40.74292259278815],
          [-74.02649579131463, 40.74293185582411],
          [-74.02648926959405, 40.742954177668025],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02683832758008, 40.742750976202075],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02677751022433, 40.74294918891226],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02641172671008, 40.7427941356587],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );

  const athleticCenter = await locationsData.create(
    "Schaefer Athletic and Recreation Center",
    "All students must wear a mask at all times and practice social distancing. Students are encouraged to minimize the number of personal belongings brought into the facilities.",
    "Recreational",
    ["09:00:00", "22:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02560305968449, 40.744579870608874],
          [-74.02560651293707, 40.74456739211655],
          [-74.02561453826596, 40.744572159842164],
          [-74.02563216399702, 40.74457988250836],
          [-74.02565826007874, 40.7445886724347],
          [-74.02569900909933, 40.74459438406723],
          [-74.02564958353233, 40.74474028573738],
          [-74.0257407717788, 40.74475129304008],
          [-74.02577301247125, 40.744747204560724],
          [-74.02581767497387, 40.744728973796754],
          [-74.02584337358066, 40.74471206890175],
          [-74.02586688768157, 40.74467951792195],
          [-74.02587630378102, 40.74462862688151],
          [-74.02590193533476, 40.744594747488236],
          [-74.02606551324534, 40.74404671795301],
          [-74.02592610872928, 40.74402149356055],
          [-74.0258395127468, 40.74400684828012],
          [-74.02579200369892, 40.74400361984826],
          [-74.02574039264448, 40.744010625905474],
          [-74.02569750221546, 40.744023133436286],
          [-74.02567148727819, 40.74403664111097],
          [-74.02564852451047, 40.744051375580256],
          [-74.02562838986444, 40.74406979092055],
          [-74.02560922020967, 40.744090146554186],
          [-74.02559729674472, 40.744110270600174],
          [-74.02558917636134, 40.74413157414796],
          [-74.02557871145878, 40.74416488757177],
          [-74.0254737702673, 40.74452101769424],
          [-74.02559740906004, 40.7445442531363],
          [-74.02558653408508, 40.744576505105414],
          [-74.02560305968449, 40.744579870608874],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.0255787406018, 40.74416537415652],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02601036875681, 40.74423235300128],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02574364955004, 40.74475094606814],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02559182655496, 40.74456133060221],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );

  await roomsData.create(library._id.toString(), 101, 60, 1, "classroom");
  await roomsData.create(library._id.toString(), 102, 60, 1, "laboratory");
  await roomsData.create(library._id.toString(), 201, 120, 2, "laboratory");
  await roomsData.create(howeCenter._id.toString(), 101, 60, 1, "classroom");
  await roomsData.create(howeCenter._id.toString(), 102, 90, 1, "classroom");
  await roomsData.create(howeCenter._id.toString(), 103, 20, 1, "admin");
  await roomsData.create(babioCenter._id.toString(), 201, 60, 2, "classroom");
  await roomsData.create(babioCenter._id.toString(), 202, 30, 2, "laboratory");
  //const itSupport = await departmentData.create("IT SUPPORT");

  await closeConnection();
}
main();
