import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
export const locations = getCollectionFn("locations");
export const users = getCollectionFn("users");
export const feedback = getCollectionFn("feedback");
export const events = getCollectionFn("events");
export const departments = getCollectionFn("department");
