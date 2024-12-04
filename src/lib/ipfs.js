import { exportDatabase } from "./rxDB";
import Gun from "gun";

const gun = Gun();

export const pinJSONToIPFS = async () => {
  const dbjson = await exportDatabase();
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataMetadata: {
        name: "IPDB content",
      },
      pinataContent: dbjson,
    }),
  };

  const res = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    options
  )
    .then((response) => response.json())
    // .then((response) => console.log(response))
    // .catch((err) => console.error(err));
  // upload
  return res.IpfsHash
};

export const storeCIDInGun = async (userId, cid) => {
  const user = gun.get(userId)
  user.put({ metadataCid: cid })
}

export const fetchCIDFromGun = async (userId) => {
  return new Promise((resolve, reject) => {
    const user = gun.get(userId)
    user.get('metadataCid').once((data) => {
      if (data) {
        resolve(data)
      } else {
        reject('No CID found in Gun')
      }
    })
  })
}

// Tải dữ liệu từ IPFS với CID
export const getFileFromIPFS = async (cid) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_PINATA_JWT,
    },
  };

  const res = await fetch(`https://api.pinata.cloud/v3/files/${cid}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return res.data;
};

export const syncWithGun = async (userId, dbJson) => {
  try {
    const cid = await pinJSONToIPFS(dbJson);
    console.log("CID:", cid);
    await storeCIDInGun(userId, cid);
  } catch (err) {
    throw new Error("Error syncing with Gun: " + err.message);
  }
};

export const syncFromGun = async (userId) => {
  try {
    const cid = await getCIDFromGun(userId); 
    console.log("CID từ Gun.js:", cid);
    const dbJson = await getFileFromIPFS(cid); 
    return dbJson;
  } catch (err) {
    console.error("Sync failed with Gun.js:", err.message);
  }
};

export const consoleLogGun = async (userId) => {
  const user = gun.get(userId)
  user.map().once((data, key) => {
    console.log(key, data)
  })
  return user
}
  