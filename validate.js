import { ObjectId } from "mongodb";

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide an ${varName} id to search for`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} is invalid object ID`;
    return id;
  },

  checkDepartmentType(type) {
    type = this.checkString(type, "Department Type");
    let departmentList = ["Administrative", "Academic"];
    if (!departmentList.includes(type))
      throw new Error(`Please check Department type`);
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

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkDayArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    if (arr.length === 0)
      throw `You must supply at least one element in an array of ${varName}`;
    arr.forEach((elm) => {
      if (!elm || typeof elm != "number" || isNaN(elm))
        throw `Expected ${varName} to contain number`;
      if (elm > 7 || elm < 1) throw `Days needs to between 1 and 7`;
    });
    return arr;
  },

  checkStringArray(arr, varName, length) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    if (arr.length === 0)
      throw `You must supply at least one element in an array of ${varName}`;
    if (arr.length !== length)
      throw new Error(`Expected ${varName} to be of length ${length}`);
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
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
      if (!Array.isArray(coordinate) || coordinate.length < 2)
        throw new Error(
          `Expected Every element inside to be Array of size two`
        );

      if (
        typeof coordinate[0] !== "number" ||
        typeof coordinate[1] !== "number"
      )
        throw new Error(`Expected Co-ordinates to be of type Number`);
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

  checkisPoint(pointArr, varName) {
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
  },

  checkisLongitudeLatitude(point, type) {
    if (!pointArr || !type)
      throw new Error(`Please ensure proper parameter are passed`);
    if (typeof point !== "number" || isNaN(point))
      throw new Error(`Expected Co-ordinates typeto be of type Number`);

    if ((type = "long" && (point < -180 || point > 180)))
      throw new Error(`Longitude needs to be in range of -180 and 180`);
    if ((type = "lat" && (point < -90 || point > 90)))
      throw new Error(`Latitude needs to be in range of -90 and 90`);
  },
};

export default exportedMethods;
