export const checkIndexedDB = (dbName) => {
  try {
    // check if indexed db exist 
    const isExist = indexedDB.databases().then((databases) => {
      return databases.some((db) => db.name === dbName);
    });
    return isExist;
  } catch (error) {
    console.error(error);
  }
}