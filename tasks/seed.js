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
  


  const admin = await userData.createUser(
    "test",
    "test@stevens.edu",
    "Aa123b123c123@",
    "administrator",
    "admin"
  );

  const sanket = await userData.createUser(
    "Sanket",
    "sanket@stevens.edu",
    "Sanket@123",
    "student"

  );

  const kavitha = await userData.createUser(
    "Kavitha",
    "kavitha@stevens.edu",
    "Kavitha@123",
    "student"

  );

  const priyank = await userData.createUser(
    "Priyank",
    "priyank@stevens.edu",
    "Priyank@123",
    "student"

  );

  const nikunj = await userData.createUser(
    "Nikunj",
    "nikunj@stevens.edu",
    "Nikunj@123",
    "student"

  );

  const library = await locationsData.create(
    "Samuel C Williams Library",
    "The Samuel C. Williams Library is the center for information discovery and preservation at Stevens Institute of Technology. The Library is dedicated to fostering an innovative environment with technology, education, and culture. It is our goal to create a distinctive library experience through services and resources that promote information and media literacy, knowledge creation, global scholarly communication, and critical and creative thinking for our students, faculty, and researchers around the world.",
    "Library",
    ["08:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02546182494333, 40.74506705869908],
          [-74.02560283482114, 40.744579791007254],
          [-74.02521485991508, 40.744510582978734],
          [-74.0250598089466, 40.74499829604784],
          [-74.02546182494333, 40.74506705869908],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02517768966909, 40.74462860838662],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02529033008382, 40.74452404375421],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );



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
          [-74.02559746970125, 40.74454411952297],
          [-74.02560691423119, 40.744568349765785],
          [-74.02565414385768, 40.74458981922231],
          [-74.02569885457082, 40.74459411311304],
          [-74.02564973575917, 40.74474010522604],
          [-74.02574230582697, 40.744752032672096],
          [-74.02578890572526, 40.74474249071568],
          [-74.02584306236416, 40.74471195644469],
          [-74.02586636231305, 40.74467808247189],
          [-74.02587517854047, 40.74462655582036],
          [-74.02590225685965, 40.74459315890286],
          [-74.02607553478764, 40.74404689510621],
          [-74.02592628891307, 40.74402017631664],
          [-74.02578397030486, 40.74400490901729],
          [-74.02570777317405, 40.744017790801536],
          [-74.02563346522841, 40.74406168426924],
          [-74.02559694098406, 40.74410462350289],
          [-74.02547327568824, 40.74452101319696],
          [-74.02559746970125, 40.74454411952297],
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


  const walkerGym = await locationsData.create(
    "Walker Gymnasium",
    "All students must wear a mask at all times and practice social distancing. Students are encouraged to minimize the number of personal belongings brought into the facilities.",
    "Recreational",
    ["09:00:00", "22:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02595267628688, 40.743712095998546],
          [-74.02573698489917, 40.7436228043758],
          [-74.02573170858476, 40.743627506201335],
          [-74.02570883672728, 40.74365813982635],
          [-74.02569119926713, 40.74365716406123],
          [-74.0256722220527, 40.74365929504114],
          [-74.02563811366345, 40.74366558805977],
          [-74.02561756292204, 40.74367443493068],
          [-74.0255995661622, 40.74368498683501],
          [-74.02557863297274, 40.74370464459162],
          [-74.02556336773928, 40.74373496614743],
          [-74.02555838442663, 40.74375548824332],
          [-74.02555965356827, 40.743787668512965],
          [-74.02556509596496, 40.74379981441979],
          [-74.02557698519956, 40.74381604470091],
          [-74.0255923033503, 40.7438329805139],
          [-74.02562073363848, 40.74385478896329],
          [-74.02565658750733, 40.74387574169302],
          [-74.02569566948131, 40.74389479525317],
          [-74.0257409920475, 40.743912119480484],
          [-74.02577716012718, 40.74391907327012],
          [-74.02581664022897, 40.74392233314745],
          [-74.02585872672927, 40.74392002073765],
          [-74.02588668999535, 40.7439121194806],
          [-74.025914735391, 40.743900776954945],
          [-74.02593586745492, 40.743887311912545],
          [-74.02595294868718, 40.74387072642736],
          [-74.02596883151777, 40.743848244839455],
          [-74.02597705174709, 40.74383146754485],
          [-74.02597956814412, 40.74380833520786],
          [-74.02597705174871, 40.74378720862899],
          [-74.02596748944079, 40.74376776220137],
          [-74.02595037794285, 40.743749536504225],
          [-74.0259351236078, 40.743738230702405],
          [-74.02595267628688, 40.743712095998546],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02584061533608, 40.74366570755666],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02596890621298, 40.7438482273476],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02574074855892, 40.74391214918694],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );


  const davisHall = await locationsData.create(
    "Davis Hall",
    "Davis Hall offers traditional double rooms for first-year men and women. Some rooms have a view of the Hudson River and New York City, while others overlook Stevens’ scenic campus lawn. Davis Hall is located on lower campus, just steps away from academic buildings, athletic facilities and local shops and restaurants.",
    "Residence",
    ["08:00:00", "22:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.0259351440346, 40.74324000651015],
          [-74.02583366176364, 40.74316606529297],
          [-74.0256633484396, 40.743319733108194],
          [-74.02560050507913, 40.74328543883345],
          [-74.02548051512285, 40.74338999885251],
          [-74.02531713856882, 40.743541367335666],
          [-74.02542389445985, 40.743611336784056],
          [-74.02562388919377, 40.74342254496926],
          [-74.02569097769413, 40.74346090071671],
          [-74.0259351440346, 40.74324000651015],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02588697938812, 40.74320506966231],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02566173494706, 40.743444225860884],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02537469152323, 40.74357908293217],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );


  const harriesTower = await locationsData.create(
    "Richard Harries Residential Tower",
    "Richard Harries from the Class of 1958 and his wife Carol made the largest gift ever received by Stevens in support of the University Complex Center project. The North Residential Tower now bears the Harries name.",
    "Recreational",
    ["06:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.0247524066985, 40.744325861137554],
          [-74.02447997784526, 40.743945661782305],
          [-74.02443320007912, 40.743965961024315],
          [-74.02441049951881, 40.743932428240754],
          [-74.0243032798277, 40.743952938316454],
          [-74.02433800967984, 40.744004664473465],
          [-74.0243006351069, 40.74401992655007],
          [-74.02459160010052, 40.74442720687611],
          [-74.02463042696509, 40.744411735820364],
          [-74.02464349652908, 40.74442951133068],
          [-74.02472172742665, 40.744358981854276],
          [-74.02471075732913, 40.744344008301454],
          [-74.0247524066985, 40.744325861137554],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02450842770644, 40.7443112381122],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02466661415029, 40.7442062965261],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );


  const southTower = await locationsData.create(
    "South Residential Tower",
    "Between the two Residential Towers, there are 937 beds, 644 rooms, and 374 suites. The Residential Towers house returning students; first-year students reside in our traditional on-campus residence halls. Second-year students have priority for selecting the Residential Towers, followed by third-, fourth- and fifth-year students. It is an institutional priority for our newer students to be housed on-campus as they transition into the University and make connections. Our older students are encouraged to live more independently in private apartments throughout Hoboken and other local communities. Richard Harries from the Class of 1958 and his wife Carol made the largest gift ever received by Stevens in support of the University Complex Center project. The North Residential Tower now bears the Harries name.",
    "Residential",
    ["06:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02497756083181, 40.74415721861803],
          [-74.02505285603002, 40.74408503045558],
          [-74.02504085816481, 40.744067657762],
          [-74.0250822302187, 40.7440504229248],
          [-74.02487619374999, 40.74377290819899],
          [-74.02483877271293, 40.743788673505776],
          [-74.02482073096273, 40.74376293794586],
          [-74.02470285293964, 40.74378238778783],
          [-74.02473643653408, 40.74383087153379],
          [-74.02470137096496, 40.74384620198674],
          [-74.02489072995914, 40.74410886068111],
          [-74.0249199233859, 40.74414896173113],
          [-74.0249602041082, 40.74413187662677],
          [-74.02497756083181, 40.74415721861803],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.0248549535671, 40.744059638691965],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );


  // const ucc = await locationsData.create(
  //   "University Campus Center",
  //   "The University Center Complex will revitalize Castle Point for the entire Stevens community. With a design that accentuates stunning views of the Manhattan skyline, the university center will become the heart of campus life, while the residential towers will signal the rise of Stevens to millions in the metropolitan region. Throughout 70,000 square feet, the university center will benefit students, faculty and alumni in numerous ways. By creating spaces for student clubs and activities, such as fitness, gaming, dining and more, the university center will provide an enriched collegiate experience.With versatile event venues, Stevens will be able to showcase its innovation and entrepreneurship to visitors from academia, industry and government, furthering the university’s impact and prestige.",
  //   "Administrative",
  //   ["08:00:00", "22:00:00"],
  //   {
  //     type: "Polygon",
  //     coordinates: [
  //       [
  //         [-74.02502470236887, 40.74413877415137],
  //         [-74.02520133701732, 40.74397286025473],
  //         [-74.02515207251356, 40.743943748269345],
  //         [-74.02526647206722, 40.743770759819114],
  //         [-74.02533850189691, 40.743705884951],
  //         [-74.02522351426153, 40.743632769815804],
  //         [-74.02519584059436, 40.74365768030367],
  //         [-74.02511331796029, 40.74360534865053],
  //         [-74.02510516944984, 40.743612264005066],
  //         [-74.02507487258663, 40.74359009111586],
  //         [-74.02493508489759, 40.74366112212235],
  //         [-74.0248204277174, 40.74376292416804],
  //         [-74.02483964624945, 40.74378805225598],
  //         [-74.02487589323567, 40.743773028597815],
  //         [-74.0250825623666, 40.744050780769726],
  //         [-74.02504096106976, 40.74406757603887],
  //         [-74.02505276298741, 40.74408539728381],
  //         [-74.02500862193135, 40.74412688190529],
  //         [-74.02502470236887, 40.74413877415137],
  //       ],
  //     ],
  //   },
  //   [
  //     {
  //       location: {
  //         coordinates: [-74.02517330165612, 40.743912250622884],
  //         type: "Point",
  //       },
  //       accessible: "Y",
  //     },
  //   ]
  // );


  const castlePointHall = await locationsData.create(
    "Castle Point Hall",
    "Castle Point Hall is one of Stevens’ residences that predominantly houses first-year students. Located on upper campus near the university’s main dining facilities and administrative offices, Castle Point Hall offers riverside rooms with incredible views of the Hudson River and Manhattan skyline. ",
    "Residence",
    ["06:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02431643146276, 40.747034830879585],
          [-74.02430290635891, 40.74701140678448],
          [-74.02433654072838, 40.746998976990966],
          [-74.02406964138088, 40.74658558551269],
          [-74.0240172591151, 40.74660699268162],
          [-74.02400434706128, 40.746585701520814],
          [-74.02394372121044, 40.74660884508532],
          [-74.02395835377641, 40.74662805960028],
          [-74.02393430706337, 40.746639507908924],
          [-74.0242011709504, 40.74704966371684],
          [-74.02422256796886, 40.74704166363014],
          [-74.02423736590846, 40.74706299671996],
          [-74.02431643146276, 40.747034830879585],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02420596650852, 40.746791913455496],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );


  const jonasHall = await locationsData.create(
    "Jonas Hall",
    "Jonas Hall is an upper-campus residence near Greek housing and Stevens’ main athletic field. It is the university’s largest residence hall and is made up of traditional doubles and a few triple rooms. Jonas residents can socialize in cozy common lounges or kitchen areas. Each room also has its own private bathroom.",
    "Residence",
    ["06:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02542708313723, 40.74592491252264],
          [-74.02554519978068, 40.74581855294443],
          [-74.02552787586338, 40.74580869113487],
          [-74.02556757136031, 40.74577268145933],
          [-74.02567916622006, 40.745791653996946],
          [-74.02568393660746, 40.74577642257174],
          [-74.02585322223788, 40.745805849311466],
          [-74.02587166794778, 40.74574689723511],
          [-74.02590053896753, 40.74575237235254],
          [-74.02592582547611, 40.74567303196605],
          [-74.02567892240903, 40.74562807464474],
          [-74.02567499962349, 40.74564468883622],
          [-74.0254968255331, 40.74561007402801],
          [-74.02534286057215, 40.7457470413795],
          [-74.02535578966877, 40.74575740212251],
          [-74.02530809840235, 40.74580395886326],
          [-74.02533038210821, 40.7458226440456],
          [-74.02526628986408, 40.74588209603036],
          [-74.02534636441409, 40.74593609390277],
          [-74.0253864780023, 40.745901442286026],
          [-74.02542708313723, 40.74592491252264],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02589516722067, 40.74575134589986],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02531243422149, 40.74583951994228],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );


  const wellnessCenter = await locationsData.create(
    "Student Wellness Center",
    "All students must wear a mask at all times and practice social distancing. Students are encouraged to minimize the number of personal belongings brought into the facilities.",
    "Health",
    ["07:00:00", "23:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02527932837376, 40.74649093644484],
          [-74.02530992789303, 40.74638995466634],
          [-74.02507179191204, 40.74634841281849],
          [-74.02503964333557, 40.74645115589581],
          [-74.02527932837376, 40.74649093644484],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02505688023838, 40.74639825550861],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );


  const burchard = await locationsData.create(
    "The Burchard Bulding",
    "Burchard is located on lower campus and contains several classrooms and research laboratories. The Burchard Building is one of the most diverse research areas on campus. It has many active labs, including the NanoPhotonics Lab, Nano-Micro-Bio Laboratory, Laboratory for Quantum Enhanced Systems and Technology, Laboratory for Microscale Imaging and the Highly Filled Materials Institute. The Burchard Building also hosts classes and faculty offices for the Department of Physics, Department of Electrical and Computer Engineering and the Department of Chemical Engineering and Materials Science. Additionally, it also boasts a newly renovated student lounge, complete with a kitchen, a quiet study room and a team meeting room.",
    "Academic",
    ["07:00:00", "22:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02745749668824, 40.74311674277524],
          [-74.02758610877567, 40.74270227039213],
          [-74.02750438343428, 40.74268781373843],
          [-74.02750794976265, 40.74267360227108],
          [-74.02727931064804, 40.74263507118698],
          [-74.02715590359722, 40.74306292479335],
          [-74.02745749668824, 40.74311674277524],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02721202140691, 40.74286850822148],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );


  const edwin = await locationsData.create(
    "Edwin A. Stevens Hall & DeBaun Auditorium",
    "Named in honor of the university’s founder, the Edwin A. Stevens Hall (EAS) serves as the home of the Charles V. Schaefer, Jr. School of Engineering &amp; Science (SES), the largest school at Stevens comprising eight academic departments that span engineering and science. In addition to administrative offices and classrooms, EAS also houses DeBaun Auditorium, the site of theatrical, musical and dance performances, as well as special events and university lectures. EAS has a rich historical and architectural pedigree. Dating back to when the university first opened its doors in 1870 as the first school of mechanical engineering in the nation, EAS has been the cornerstone building on the Stevens campus. Built in the high Victorian Gothic style, the 80,000-square-foot, five-story masonry building was designed by Civil War architect Richard Upjohn, famous for the design of Trinity Church in New York City.",
    "Academic",
    ["07:00:00", "22:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.0277416776487, 40.74269487793072],
          [-74.02778831950889, 40.74253723696958],
          [-74.02783417857823, 40.74254582353214],
          [-74.02785586580532, 40.74247230488763],
          [-74.02790610074575, 40.7424807759663],
          [-74.02787585598016, 40.74258428395143],
          [-74.0280007455982, 40.74260909677375],
          [-74.02808867091639, 40.74232007563285],
          [-74.0278702833375, 40.74228267354019],
          [-74.02787728751383, 40.742261089713566],
          [-74.02767463828155, 40.742226509230704],
          [-74.02766818511364, 40.74225100152967],
          [-74.02745605768493, 40.74221723624336],
          [-74.02737227998507, 40.742526098934206],
          [-74.02747200705092, 40.742541699653884],
          [-74.02755526791712, 40.74257159249754],
          [-74.02752982073515, 40.74265724411839],
          [-74.0277416776487, 40.74269487793072],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02745327911464, 40.742539317300526],
          type: "Point",
        },
        accessible: "N",
      },
      {
        location: {
          coordinates: [-74.02742108986381, 40.74234367766641],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02777681847982, 40.742244071465166],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );


  const mcLeanHall = await locationsData.create(
    "McLean Hall",
    "McLean Hall hosts most of the chemistry and biomedical engineering labs at Stevens. Active research labs include the Center for Healthcare Innovation, the Movement Control Rehabilitation (MOCORE) Laboratory, the Translational Research in Medicine lab, the Motion Capture Laboratory, the Center for Mass Spectrometry and the Synthetic Organic and Medicinal Chemistry. McLean also has multiple neuroengineering-focused labs, including the McConnell lab and the Yu Lab. McLean Hall also hosts classes and faculty offices for the biomedical engineering chemistry and biological sciences, chemical engineering and materials science and mechanical engineering departments.",
    "Academic",
    ["08:00:00", "21:30:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02701384599938, 40.74242892848841],
          [-74.02716996149124, 40.74192263020788],
          [-74.02717564387757, 40.74190549981765],
          [-74.02692890250673, 40.74186299925623],
          [-74.02691983773933, 40.74189481279427],
          [-74.02692664168012, 40.74190140316168],
          [-74.02692245378606, 40.74191562591312],
          [-74.02691345723085, 40.74191562591313],
          [-74.02678685119602, 40.742335091223794],
          [-74.02679232259766, 40.74233545169923],
          [-74.0267909992311, 40.742347388645555],
          [-74.02678254935918, 40.74234945996176],
          [-74.02677210185972, 40.74238620640736],
          [-74.02701384599938, 40.74242892848841],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02717033544323, 40.74192258577952],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02703163619395, 40.74237188521056],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );


  const gatewaySouthHall = await locationsData.create(
    "Gateway South hall",
    "Breaking ground in 2017, the Gateway Academic Center is comprised of two buildings – South Hall and Gianforte Family Hall – connected by a glass skybridge. With 10 new smart classrooms, 13 labs and 45 faculty offices, the new four-story building will have an impact throughout the Stevens community. The new technology-enabled smart classrooms expand students’ opportunities to learn and provides professors with new possibilities to collaborate and conduct research. The classrooms are also equipped for active video conferencing for online learning.",
    "Academic",
    ["08:00:00", "22:30:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02787077472898, 40.743197012484984],
          [-74.02792512775022, 40.74301426516584],
          [-74.02770844014083, 40.7429756164405],
          [-74.02777914286482, 40.74274363800404],
          [-74.02760745926466, 40.74271318632282],
          [-74.02748157619183, 40.7431286484499],
          [-74.02787077472898, 40.743197012484984],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.02762118661329, 40.74315320731222],
          type: "Point",
        },
        accessible: "Y",
      },
      {
        location: {
          coordinates: [-74.02776225099481, 40.742740986961536],
          type: "Point",
        },
        accessible: "N",
      },
    ]
  );


  const gianforteFamilyHall = await locationsData.create(
    "Gianforte Family Hall",
    "Breaking ground in 2017, the Gateway Academic Center is comprised of two buildings – South Hall and Gianforte Family Hall – connected by a glass skybridge. With 10 new smart classrooms, 13 labs and 45 faculty offices, the new four-story building will have an impact throughout the Stevens community. The new technology-enabled smart classrooms expand students’ opportunities to learn and provides professors with new possibilities to collaborate and conduct research. The classrooms are also equipped for active video conferencing for online learning.",
    "Academic",
    ["08:30:00", "22:00:00"],
    {
      type: "Polygon",
      coordinates: [
        [
          [-74.02775382051752, 40.743531150876095],
          [-74.02781533556845, 40.743327804726334],
          [-74.02746279984584, 40.743265827201924],
          [-74.02740107675292, 40.74347015442214],
          [-74.02775382051752, 40.743531150876095],
        ],
      ],
    },
    [
      {
        location: {
          coordinates: [-74.0275822383959, 40.74328706576168],
          type: "Point",
        },
        accessible: "Y",
      },
    ]
  );



  // const ISSS = await departmentData.create(
  //   "International Student and Scholar Services (ISSS)",
  //   // "64236f804eebf566c9d8d8df",
  //   "The International Student and Scholar Services (ISSS) office is committed to assisting international students, faculty and scholars in accomplishing their academic, personal and professional objectives through advising, providing immigration services, promoting cross-cultural opportunities and offering specific programs and services to our international population.",
  //   "Administrative",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     5,
  //     7
  //   ]
  // )

  // const BioEngineering = await departmentData.create(
  //   "Department of Biomedical Engineering",
  //   // "64236f804eebf566c9d8d8df",
  //   "The Department of Biomedical Engineering amplifies broad-based education and hands-on research initiatives at the boundary between science and engineering.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // const ChemAndBio = await departmentData.create(
  //   "Department of Chemistry and Chemical Biology",
  //   // "64236f804eebf566c9d8d8df",
  //   "The Department of Chemistry and Chemical Biology at Stevens is known for its legacy of fostering and nurturing groundbreaking, world-class innovation.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // const ChemEngineering = await departmentData.create(
  //   "Department of Chemical Engineering and Materials Science",
  //   // "64236f804eebf566c9d8d8df",
  //   "The Department of Chemical Engineering and Materials Science at Stevens harnesses the synergy between two impactful disciplines to drive discoveries and innovation that change industry – and society.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // const CivilEngineering = await departmentData.create(
  //   "Department of Civil, Environmental and Ocean Engineering",
  //   // "64236f804eebf566c9d8d8df",
  //   "The Department of Civil, Environmental and Ocean Engineering at Stevens was founded on the core principles of engineering that underpin the infrastructure which supports our economy and our society.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // const ComputerScience = await departmentData.create(
  //   "Department of Computer Science",
  //   // "64236f804eebf566c9d8d8df",
  //   "The Department of Computer Science at Stevens is one of the leading computer science departments in the country, with globally-recognized experts in cybersecurity, artificial intelligence, machine learning, and computer vision.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )


  // const ElectricalEngineering = await departmentData.create(
  //   "Department of Electrical and Computer Engineering",
  //   // "64236f804eebf566c9d8d8df",
  //   "As one of the first in the nation, the Department of Electrical and Computer Engineering at Stevens has a long legacy of innovation and discovery.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // const MathematicalSciences = await departmentData.create(
  //   "Department of Mathematical Sciences",
  //   // "64236f804eebf566c9d8d8df",
  //   "The Department of Mathematical Sciences at Stevens is a leader in the field of algebraic cryptography.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )


  // const MechanicalEngineering = await departmentData.create(
  //   "Department of Mechanical Engineering",
  //   // "64236f804eebf566c9d8d8df",
  //   "As the founding department at Stevens and the home of its very first degree, the Department of Mechanical Engineering is the legacy of our university.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // const Physics = await departmentData.create(
  //   "Department of Physics",
  //   // "64236f804eebf566c9d8d8df",
  //   "As one of the first departments established at Stevens Institute of Technology, the Department of Physics has been an active participant in the revolution of physics science and education for 150 years.",
  //   "Academic",
  //   [
  //     "08:00:00",
  //     "16:00:00"
  //   ],
  //   [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ]
  // )

  // await roomsData.create(library._id.toString(), 101, 60, 1, "classroom");
  // await roomsData.create(library._id.toString(), 102, 60, 1, "laboratory");
  // await roomsData.create(library._id.toString(), 201, 120, 2, "laboratory");
  // await roomsData.create(howeCenter._id.toString(), 101, 60, 1, "classroom");
  // await roomsData.create(howeCenter._id.toString(), 102, 90, 1, "classroom");
  // await roomsData.create(howeCenter._id.toString(), 103, 20, 1, "admin");
  // await roomsData.create(babioCenter._id.toString(), 201, 60, 2, "classroom");
  // await roomsData.create(babioCenter._id.toString(), 202, 30, 2, "laboratory");
  //const itSupport = await departmentData.create("IT SUPPORT");



  const DavisRoom116 = await roomsData.create(
    davisHall._id,
    116,
    52,
    1,
    "admin"
  )


  const ComputerScience = await departmentData.create(
    "Department of Computer Science",
    DavisRoom116._id,
    "The Department of Computer Science at Stevens is one of the leading computer science departments in the country, with globally-recognized experts in cybersecurity, artificial intelligence, machine learning, and computer vision.",
    "Academic",
    [
      "08:00:00",
      "16:00:00",
    ],
    [1,2],
  )


  const GatewaySouth103 = await roomsData.create(
    gatewaySouthHall._id,
    103,
    40,
    1,
    "admin"
  )


  const MechanicalEngineering = await departmentData.create(
    "Department of Mechanical Engineering",
    GatewaySouth103._id,
    "As the founding department at Stevens and the home of its very first degree, the Department of Mechanical Engineering is the legacy of our university.",
    "Academic",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5
    ]
  )


  const McLean211 = await roomsData.create(
    mcLeanHall._id,
    211,
    40,
    2,
    "admin"
  )


  const BioEngineering = await departmentData.create(
    "Department of Biomedical Engineering",
    McLean211._id,
    "The Department of Biomedical Engineering amplifies broad-based education and hands-on research initiatives at the boundary between science and engineering.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );


  const Burchard514 = await roomsData.create(
    burchard._id,
    514,
    21,
    5,
    "admin"
  )


  const SystemsEnginnering = await departmentData.create(
    "Department of Systems Engineering",
    Burchard514._id,
    "The Systems Engineering Department is a team of interdisciplinary engineers committed to designing, developing, and optimizing complex systems. Their expertise includes mechanical, electrical, and computer engineering, and they work together to create reliable and innovative solutions.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );


  const Edwin231 = await roomsData.create(
    edwin._id,
    231,
    19,
    2,
    "admin"
  )


  const ElectricalEngineering = await departmentData.create(
    "Department of Electrical and Computer Engineering",
    Edwin231._id,
    "As one of the first in the nation, the Department of Electrical and Computer Engineering at Stevens has a long legacy of innovation and discovery.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );


  const Babbio110 = await roomsData.create(
    babioCenter._id,
    110,
    29,
    1,
    "admin"
  )


  const FinancialEngineering = await departmentData.create(
    "Department of Financial Engineering",
    Babbio110._id,
    "The Financial Engineering Department is a team of experts who combine financial theory, mathematics, and computer science to develop advanced financial models and innovative investment strategies. Their goal is to optimize financial decision-making and help clients navigate complex financial markets. They specialize in risk management, quantitative analysis, and portfolio optimization, and are dedicated to providing tailored solutions that meet each client's unique needs.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );



  const Howe303 = await roomsData.create(
    howeCenter._id,
    303,
    59,
    3,
    "admin"
  )


  const ISSS = await departmentData.create(
    "International Student and Scholar Services (ISSS)",
    Howe303._id,
    "The International Student and Scholar Services (ISSS) office is committed to assisting international students, faculty and scholars in accomplishing their academic, personal and professional objectives through advising, providing immigration services, promoting cross-cultural opportunities and offering specific programs and services to our international population.",
    "Administrative",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5,
      6
    ]
  )


  const Babbio121 = await roomsData.create(
    babioCenter._id,
    121,
    59,
    1,
    "admin"
  )


  const BIA = await departmentData.create(
    "Business Intelligence and Analytics",
    Babbio121._id,
    "The Business Intelligence and Analytics Department is a team of data experts who specialize in transforming raw data into actionable insights. Using advanced analytics techniques and cutting-edge technology, they help businesses make informed decisions and gain a competitive edge in the marketplace. Their expertise includes data warehousing, data mining, predictive modeling, and visual analytics, and they are committed to delivering solutions that drive business growth and success.",
    "Administrative",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5
    ]
  )


  const Babbio122 = await roomsData.create(
    babioCenter._id,
    122,
    59,
    1,
    "admin"
  )


  const management = await departmentData.create(
    "Department of Management studies",
    Babbio122._id,
    "The Management Studies Department is a team of experts dedicated to advancing the theory and practice of management. With a focus on interdisciplinary collaboration, they bring together insights from psychology, sociology, economics, and other fields to develop innovative approaches to leadership, organizational behavior, and strategic planning.",
    "Administrative",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5
    ]
  )



  const Burchard111 = await roomsData.create(
    burchard._id,
    111,
    35,
    1,
    "admin"
  )


  const MIS = await departmentData.create(
    "Department of Information Systems",
    Babbio122._id,
    "The Information Systems (IS) Department is a critical component of our organization's IT function. Led by a team of experienced professionals, the IS Department is responsible for managing and maintaining our technology infrastructure, ensuring that it remains secure, reliable, and efficient.",
    "Administrative",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5
    ]
  )


  const GatewaySouth216 = await roomsData.create(
    gatewaySouthHall._id,
    216,
    40,
    2,
    "admin"
  )


  const ChemEngineering = await departmentData.create(
    "Department of Chemical Engineering and Materials Science",
    GatewaySouth216._id,
    "The Department of Chemical Engineering and Materials Science at Stevens harnesses the synergy between two impactful disciplines to drive discoveries and innovation that change industry – and society.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );

  const McLean323 = await roomsData.create(
    mcLeanHall._id,
    323,
    45,
    3,
    "admin"
  )


  const ChemAndBio = await departmentData.create(
    "Department of Chemistry and Chemical Biology",
    McLean323._id,
    "The Department of Chemistry and Chemical Biology at Stevens is known for its legacy of fostering and nurturing groundbreaking, world-class innovation.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );


  const GatewaySouth121 = await roomsData.create(
    gatewaySouthHall._id,
    121,
    29,
    1,
    "admin"
  )


  const Physics = await departmentData.create(
    "Department of Physics",
    GatewaySouth121._id,
    "As one of the first departments established at Stevens Institute of Technology, the Department of Physics has been an active participant in the revolution of physics science and education for 150 years.",
    "Academic",
    ["08:00:00", "16:00:00"],
    [1, 2, 3, 4, 5]
  );


  const Edwin122 = await roomsData.create(
    edwin._id,
    122,
    39,
    1,
    "admin"
  )


  const CivilEngineering = await departmentData.create(
    "Department of Civil, Environmental and Ocean Engineering",
    Edwin122._id,
    "The Department of Civil, Environmental and Ocean Engineering at Stevens was founded on the core principles of engineering that underpin the infrastructure which supports our economy and our society.",
    "Academic",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5
    ]
  )


  const Babbio304 = await roomsData.create(
    babioCenter._id,
    304,
    29,
    3,
    "admin"
  )


  const MathematicalSciences = await departmentData.create(
    "Department of Mathematical Sciences",
    Babbio304._id,
    "The Department of Mathematical Sciences at Stevens is a leader in the field of algebraic cryptography.",
    "Academic",
    [
      "08:00:00",
      "16:00:00"
    ],
    [
      1,
      2,
      3,
      4,
      5
    ]
  )

  await closeConnection();
}
main();
