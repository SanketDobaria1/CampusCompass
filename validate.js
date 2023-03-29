import {ObjectId} from 'mongodb';

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide an ${varName} id to search for`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} is invalid object ID`;
        return id;
      },
    
      checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0) throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal)) throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
      },
    
      checkStringArray(arr, varName) {
        if (!arr || !Array.isArray(arr)) throw `You must provide an array of ${varName}`;
        if(arr.length === 0) throw `You must supply at least one element in an array of ${varName}`;
        for (let i in arr) {
          if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
            throw `One or more elements in ${varName} array is not a string or is an empty string`;
          }
          arr[i] = arr[i].trim();
        }
        return arr;
      }
};

export default exportedMethods;