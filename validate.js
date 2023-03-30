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

  checkStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    if (arr.length === 0)
      throw `You must supply at least one element in an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }
    return arr;
  },

  checkisPolygon(cordinatesArr, varName) {
    if (!cordinatesArr || !varName)
      throw new Error(`Please ensure proper parameter are passed`);

    if (!Array.isArray(cordinatesArr))
      throw new Error(`Expected arr to be of type Array`);

    if (cordinatesArr.length < 4)
      throw new Error("A Polygon must have atleast three side");

    //check every co-ordinate and every co-ordinate is number
    cordinatesArr.forEach((cordinate) => {
      if (!Array.isArray(cordinate) || cordinate.length < 2)
        throw new Error(
          `Expected Every element inside to be Array of size two`
        );

      if (typeof cordinate[0] !== "number" || typeof cordinate[1] !== "number")
        throw new Error(`Expected Co-ordinates to be of type Number`);
    });

    //check if start and end of polygon is same or not
    if (
      cordinatesArr[0][0] !== cordinatesArr[cordinatesArr.length - 1][0] ||
      cordinatesArr[0][1] !== cordinatesArr[cordinatesArr.length - 1][1]
    )
      throw new Error("Expected Polygon start and End Point to be same");

    //iterate over polygon points and check if two consecutive points are same or not
    for (let i = 0; i < cordinatesArr.length - 1; i++)
      if (
        cordinatesArr[i][0] === cordinatesArr[i + 1][0] ||
        cordinatesArr[i][1] === cordinatesArr[i + 1][1]
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

    pointArr.forEach((cordinate) => {
      if (typeof cordinate !== "number")
        throw new Error(
          `Expected Co-ordinates of ${varName} to be of type Number`
        );
    });
  },
};

export default exportedMethods;
