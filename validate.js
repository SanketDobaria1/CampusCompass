import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import * as turf from "@turf/turf";
import { ObjectId } from "mongodb";

const exportedMethods = {
  checkId(id, varName) {
    if (!id)
      throw new Error(`Error: You must provide an ${varName} id to search for`);
    if (typeof id !== "string")
      throw new Error(`Error:${varName} must be a string`);
    id = id.trim();
    if (id.length === 0)
      throw new Error(
        `Error: ${varName} cannot be an empty string or just spaces`
      );
    if (!ObjectId.isValid(id))
      throw new Error(`Error: ${varName} is invalid object ID`);
    return id;
  },

  checkDepartmentType(type) {
    type = this.checkString(type, "Department Type");
    let departmentList = ["Administrative", "Academic"];
    if (!departmentList.includes(type))
      throw new Error(`Please check Department type`);
    return type;
  },

  checkLocationType(type) {
    type = this.checkString(type, "Department Type");
    let locationList = [
      "Residence",
      "Academic",
      "Recreational",
      "Administrative",
      "Parking",
      "Health",
    ];
    if (!locationList.includes(type))
      throw new Error(`Please check Location type`);
    return type;
  },

  checkStevensMail(emailid) {
    if (!emailid) throw new Error(`Expected Emailid to be non-empty`);
    if (typeof emailid !== "string" || emailid.trim().length === 0)
      throw new Error(`Expected Emailid to be non-empty string`);
    emailid = emailid.trim().toLowerCase();
    let regex = /^[\w._%+-]+(@stevens\.edu)$/;
    if (!regex.test(emailid))
      throw new Error(`Expected email id to be of Stevens`);
    return emailid;
  },

  checkNumber(number, varName) {
    if (!number) throw new Error(`Expected Input for Number`);
    if (!varName || typeof varName !== "string" || varName.trim().length === 0)
      throw new Error(`Expected VarName with VarName as String`);
    if (isNaN(number) || typeof number !== "number")
      throw new Error(`Error: Expected ${varName} to be number`);
    return number;
  },

  checkRoomType(type, varName) {
    if (!type || typeof type !== "string" || type.trim().length === 0)
      throw new Error(`Expected Input parameter type as String`);
    if (!varName || typeof varName !== "string" || varName.trim().length === 0)
      throw new Error(`Expected VarName with VarName as String`);
    type = type.trim().toLowerCase();

    if (type !== "classroom" && type !== "admin" && type !== "laboratory")
      throw new Error(
        `Expected Room Type to be of classroom, admin, laboratory`
      );
    return type;
  },

  checkPassword(password) {
    password = password.trim();
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
    if (!regex.test(password))
      throw new Error(`Password must contain 8 digit AlphaNumeric Character`);
    return password;
  },

  checkString(strVal, varName) {
    if (!strVal) throw new Error(`Error: You must supply a ${varName}!`);
    if (typeof strVal !== "string")
      throw new Error(`Error: ${varName} must be a string!`);
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw new Error(
        `Error: ${varName} cannot be an empty string or string with just spaces`
      );
    if (!isNaN(strVal))
      throw new Error(
        `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
      );
    return strVal;
  },

  // Todo : Need To work On it
  checkDayArray(arr, varName) {
    // if (!arr || !Array.isArray(arr))
    //   throw new Error(`You must provide an array of ${varName}`);
    if (arr.length === 0)
      throw new Error(
        `You must supply at least one element in an array of ${varName}`
      );
    arr = arr.split(",").join("");
    // arr.forEach((elm) => {
    //   if (typeof elm != "number" || isNaN(elm))
    //     throw new Error(`Expected ${varName} to contain number`);
    //   if (elm > 8 || elm < 0) throw new Error(`Days needs to between 0 and 8`);
    // });
    if (arr.length === 7) {
      arr = "0";
    }
    return arr;
  },

  checkStringArray(arr, varName, length) {
    if (!arr || !Array.isArray(arr))
      throw new Error(`You must provide an array of ${varName}`);
    if (arr.length === 0)
      throw new Error(
        `You must supply at least one element in an array of ${varName}`
      );
    if (arr.length !== length)
      throw new Error(`Expected ${varName} to be of length ${length}`);
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw new Error(
          `One or more elements in ${varName} array is not a string or is an empty string`
        );
      }
      arr[i] = arr[i].trim();
    }
    return arr;
  },

  formatTime(time) {
    let timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!time || typeof time !== "string" || !timeRegex.test(time)) return "";
    let splitTime = time.split(":");
    return `${splitTime[0] % 12}:${splitTime[1]}:${splitTime[2]} ${
      splitTime[0] > 12 ? "PM" : "AM"
    }`;
  },

  checkTime(time, varName) {
    let timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!time || !varName)
      throw new Error(`Please ensure time Parameter is passed`);

    if (typeof time !== "string" || time.trim().length < 0)
      throw Error(`Please time is passed properly`);
    if (typeof varName !== "string" || varName.trim().length === 0)
      throw Error(`Please ensure proper parameter is passed for varName`);

    time = time.trim();
    if (!timeRegex.test(time))
      throw new Error(
        `Please Ensure ${varName} is passed in 24 hour HH:MM:SS format`
      );
    return time;
  },

  returnDay(day) {
    if (typeof day !== "number" || isNaN(day))
      throw new Error(`Error expected Day to be Integer`);
    let dayIdDay = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };
    return dayIdDay[day];
  },

  checkOperatingTimes(startTime, endTime) {
    startTime = this.checkTime(startTime, "StartTime");
    endTime = this.checkTime(endTime, "End Time");

    let startTimeDT = new Date(`01/01/2023 ${startTime}`);
    let endTimeDT = new Date(`01/01/2023 ${endTime}`);

    if (endTimeDT < startTimeDT)
      throw new Error("End time cannot be less than starttime");
    else return true;
  },

  checkisPolygon(coordinatesArr, varName) {
    if (!coordinatesArr || !varName)
      throw new Error(`Please ensure proper parameter are passed`);

    if (!Array.isArray(coordinatesArr))
      throw new Error(`Expected arr to be of type Array`);

    if (coordinatesArr.length < 4)
      throw new Error("A Polygon must have atleast three side");

    //check every co-ordinate and every co-ordinate is number
    coordinatesArr.forEach((coordinate) => {
      this.checkisPointValid(coordinate, "Co-ordinates");
    });

    //check if start and end of polygon is same or not
    if (
      coordinatesArr[0][0] !== coordinatesArr[coordinatesArr.length - 1][0] ||
      coordinatesArr[0][1] !== coordinatesArr[coordinatesArr.length - 1][1]
    )
      throw new Error("Expected Polygon start and End Point to be same");

    //iterate over polygon points and check if two consecutive points are same or not
    for (let i = 0; i < coordinatesArr.length - 1; i++)
      if (
        coordinatesArr[i][0] === coordinatesArr[i + 1][0] ||
        coordinatesArr[i][1] === coordinatesArr[i + 1][1]
      )
        throw new Error(
          `${varName} to be Polygon, it cannot have two consecutive points equal`
        );
  },

  checkisPointValid(pointArr, varName) {
    const stevensCoordinates = turf.polygon([
      [
        [-74.02830958083189, 40.742031322137876],
        [-74.02657969024786, 40.74174566451546],
        [-74.02604002352678, 40.74252421867942],
        [-74.02484979966336, 40.74236738835782],
        [-74.02462801881939, 40.74326915765775],
        [-74.02528596865676, 40.74336997582563],
        [-74.02352651675685, 40.74434454634505],
        [-74.02330473591242, 40.745716758328626],
        [-74.02367437405573, 40.746545672031345],
        [-74.02447278509482, 40.74778342353321],
        [-74.02465021062717, 40.74799624740484],
        [-74.02638010121169, 40.74829307936275],
        [-74.02830958083189, 40.742031322137876],
      ],
    ]);
    if (!pointArr || !varName)
      throw new Error(`Please ensure proper parameter are passed`);

    if (!Array.isArray(pointArr))
      throw new Error(`Expected ${varName} to be of type Array`);

    if (pointArr.length < 2)
      throw new Error(`Expected ${varName} to have two co-ordinates`);

    pointArr.forEach((coordinate) => {
      if (typeof coordinate !== "number" || isNaN(coordinate))
        throw new Error(
          `Expected Co-ordinates of ${varName} to be of type Number`
        );
    });

    this.checkisLongitudeLatitude(pointArr[0], "long");
    this.checkisLongitudeLatitude(pointArr[1], "lat");
    let pt1 = turf.point(pointArr);
    if (!booleanPointInPolygon(pt1, stevensCoordinates))
      throw new Error(`Point is outside Stevens Campus boundaries`);
  },

  checkisLongitudeLatitude(coordinate, type) {
    if (!coordinate || !type)
      throw new Error(`Please ensure proper parameter are passed`);
    if (typeof coordinate !== "number" || isNaN(coordinate))
      throw new Error(`Expected Co-ordinates typeto be of type Number`);

    if ((type = "long" && (coordinate < -180 || coordinate > 180)))
      throw new Error(`Longitude needs to be in range of -180 and 180`);
    if ((type = "lat" && (coordinate < -90 || coordinate > 90)))
      throw new Error(`Latitude needs to be in range of -90 and 90`);
  },
};

export default exportedMethods;
