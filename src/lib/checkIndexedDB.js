export const checkIndexedDB = (dbName) => {
  try {
    // check if indexed db exist 
    // if not create one
    const dbExists = indexedDB.databases().then((dbs) => {
      return dbs.find((db) => db.name === dbName);
    });
    if (!dbExists) {
      indexedDB.open(dbName, 1, (upgradeDb) => {
        upgradeDb.createObjectStore("users", { keyPath: "id" });
      }
      );
    }

  } catch (error) {
    console.error(error);
  }
}