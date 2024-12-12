import { createRxDatabase } from "rxdb";
import { addRxPlugin } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'

import { Dexie } from "dexie";
import { pinata } from "../../utils/config";
import axios from "axios";

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

let dbInstance = null;

export const databaseExists = async (dbName) => {
  const db = new Dexie(dbName);
  try {
    await db.open(); // Mở database
    db.close(); // Đóng lại để không xung đột
    return true;
  } catch (error) {
    if (error.name === "NoSuchDatabaseError") {
      return false; // Database chưa tồn tại
    }
    throw error; // Nếu lỗi khác, ném ra
  }
};

export const exportDatabase = async () => {
  const db = await getDatabase();
  const exported = await db.exportJSON();
  console.log(exported);
  return exported;
};

export const getDatabase = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const exists = await databaseExists("nftmarketplace");

  if (!exists) {
    try {
      // Tạo instance database
      dbInstance = await createRxDatabase({
        name: "nftmarketplace", // Tên database
        multiInstance: false, // Môi trường dev không cần đa instance
        storage: getRxStorageDexie(), // Sử dụng Dexie làm storage
        ignoreDuplicate: true, // Cho phép schema trùng lặp (môi trường dev)
      });

      // Thêm collections
      await dbInstance.addCollections({
        users: {
          schema: {
            version: 0,
            type: "object",
            primaryKey: "walletAddress",
            properties: {
              walletAddress: { type: "string", maxLength: 42 },
              name: { type: "string" },
              email: { type: "string" },
              bio: { type: "string" },
              image: { type: "string" },
              facebook: { type: "string" },
              insta: { type: "string" },
              twitter: { type: "string" },
              followers: {
                type: "array",
                items: { type: "string" },
                default: [],
              },
              following: {
                type: "array",
                items: { type: "string" },
                default: [],
              },
            },
            required: ["walletAddress", "name"],
          },
        },
        albums: {
          schema: {
            version: 0,
            primaryKey: "albumname",
            type: "object",
            properties: {
              owner: { type: "string", maxLength: 42 },
              albumname: { type: "string", maxLength: 100 },
              descript: { type: "string" },
              image: { type: "string" },
              nfts: { type: "array", items: { type: "string" }, default: [] },
            },
            required: ["albumname", "owner"],
          },
        },
      });

      console.log("Database initialized successfully");
    } catch (err) {
      console.error("Error initializing database:", err);
      throw err; // Rethrow error để ứng dụng có thể xử lý
    }
  }

  return dbInstance;
};

export const getUsers = async () => {
  try {
    // Add more robust error checking
    if (!window.indexedDB) {
      console.error("IndexedDB is not supported in this environment");
      return [];
    }

    const db = await getDatabase();

    if (!db.users) {
      console.warn("Collection 'users' does not exist yet");
      return [];
    }

    const users = await db.users.find().exec();
    return users;
  } catch (error) {
    console.error("Error in getUsers:", error);

    // Provide a fallback mechanism
    if (error.name === "MissingAPIError") {
      console.warn("Falling back to alternative data storage");
      return [];
    }

    throw error;
  }
};

export const addUser = async (walletAddress) => {
  const db = await getDatabase();
  const isExist = await db.users.findOne(walletAddress).exec();

  if (isExist) {
    return { message: "User already exists" };
  }
  const user = {
    walletAddress,
    name: "walletAddress",
    email: "",
    bio: "",
    image: "",
    facebook: "",
    insta: "",
    twitter: "",
  };
  const createdUser = await db.users.insert(user);
  return createdUser;
};

export const getUserByWalletAddress = async (walletAddress) => {
  try {
    if (!window.indexedDB) {
      console.error("IndexedDB is not supported in this environment");
      return [];
    }

    const db = await getDatabase();

    if (!db.users) {
      console.warn("Collection 'users' does not exist yet");
      return [];
    }
    
    // // Log toàn bộ documents trong collection
    // const allUsers = await db.users.find().exec();
    // console.log("ALL USERS:", allUsers);

    // Log chi tiết từng user
    // allUsers.forEach(user => {
    //   console.log("USER DETAILS:", {
    //     walletAddress: user.walletAddress,
    //     type: typeof user.walletAddress,
    //     compareResult: user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    //   });
    // });

    // Thử query với nhiều cách
    // const userByFind = allUsers.find(
    //   u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    // );

    const userByFindOne = await db.users
      .findOne()
      .where('walletAddress')
      .eq(walletAddress.toLowerCase())
      .exec();

    // console.log("User by .find():", userByFind);
    console.log("User by .findOne():", userByFindOne);

    return userByFindOne || userByFind || null;
  } catch (error) {
    console.error("Detailed Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (walletAddress, data) => {
  try {
    const db = await getDatabase();
    const user = await db.users
      .findOne({
        selector: { walletAddress },
      })
      .exec();

    if (!user) {
      console.error(`User with wallet address ${walletAddress} not found`);
      return null;
    }

    const updatedUser = await user.update({ $set: data });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const followUser = async (walletAddress, followAddress) => {
  try {
    const db = await getDatabase();
    const user = await db.users
      .findOne({
        selector: { walletAddress },
      })
      .exec();

    const followedUser = await db.users
      .findOne({
        selector: { walletAddress: followAddress },
      })
      .exec();

    if (!followedUser) {
      console.error(`User with wallet address ${followAddress} not found`);
      return null;
    }

    if (!user) {
      console.error(`User with wallet address ${walletAddress} not found`);
      return null;
    }

    // Prevent duplicate follows
    if (
      !user.following.includes(followAddress) &&
      !followedUser.followers.includes(walletAddress)
    ) {
      const following = [...user.following, followAddress];
      const followers = [...followedUser.followers, walletAddress];
      const updatedUser = await user.update({
        $set: { following },
      });
      const updatedFollowedUser = await followedUser.update({
        $set: { followers },
      });
      return {
        user: updatedUser,
        followedUser: updatedFollowedUser,
      };
    }

    return {
      user,
      followedUser,
    };
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const checkFollow = async (walletAddress, followAddress) => {
  if (walletAddress === followAddress) {
    return;
  }

  try {
    const db = await getDatabase();
    const user = await db.users
      .findOne({
        selector: { walletAddress },
      })
      .exec();

    if (!user) {
      console.error(`User with wallet address ${walletAddress} not found`);
      return null;
    }

    return user.following.includes(followAddress);
  } catch (error) {
    console.error("Error checking follow:", error);
    throw error;
  }
};

export const unfollowUser = async (walletAddress, followAddress) => {
  try {
    const db = await getDatabase();
    const user = await db.users
      .findOne({
        selector: { walletAddress },
      })
      .exec();

    const followedUser = await db.users
      .findOne({
        selector: { walletAddress: followAddress },
      })
      .exec();

    if (!user) {
      console.error(`User with wallet address ${walletAddress} not found`);
      return;
    }

    if (!followedUser) {
      console.error(`User with wallet address ${followAddress} not found`);
      return;
    }

    const following = user.following.filter(
      (address) => address !== followAddress
    );

    const followers = followedUser.followers.filter(
      (address) => address !== walletAddress
    );

    const updatedUser = await user.update({
      $set: { following },
    });

    const updatedFollowedUser = await followedUser.update({
      $set: { followers },
    });

    return {
      user: updatedUser,
      followedUser: updatedFollowedUser,
    };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

export const getFollowers = async (walletAddress) => {
  try {
    const db = await getDatabase();

    const user = await db.users
      .findOne({
        selector: { walletAddress },
      })
      .exec();
    const users = await db.users
      .find({
        selector: { following: walletAddress },
      })
      .exec();

    const usersFollowing = await db.users
      .find({
        selector: { followers: walletAddress },
      })
      .exec();
    
    return {
      user: user,
      followers: users,
      following: usersFollowing,
    };
  } catch (error) {
    console.error("Error getting followers:", error);
    throw error;
  }
};

export const getFollowing = async (walletAddress) => {
  try {
    const db = await getDatabase();
    const users = await db.users
      .find({
        selector: { followers: walletAddress },
      })
      .exec();
    return users;
  } catch (error) {
    console.error("Error getting following:", error);
    throw error;
  }
}

export const addAlbum = async (walletAddress, albumname, descript, image) => {
  try {
    const db = await getDatabase();

    // Check if album with same name already exists
    const existingAlbum = await db.albums
      .findOne({
        selector: { albumname },
      })
      .exec();

    if (existingAlbum) {
      throw new Error(`Album with name ${albumname} already exists`);
    }

    const album = {
      owner: walletAddress,
      albumname,
      descript,
      image,
      nfts: [],
    };

    const res = await db.albums.insert(album);
    return res;
  } catch (error) {
    console.error("Error adding album:", error);
    throw error;
  }
};

export const getAlbums = async () => {
  try {
    const db = await getDatabase();
    const albums = await db.albums.find().exec();
    return albums;
  } catch (error) {
    console.error("Error getting albums:", error);
    throw error;
  }
};

export const getAlbumByName = async (albumname) => {
  try {
    const db = await getDatabase();
    const album = await db.albums
      .findOne({
        selector: { albumname },
      })
      .exec();
    return album;
  } catch (error) {
    console.error(`Error getting album ${albumname}:`, error);
    throw error;
  }
};

export const getAlbumsByOwnerAddress = async (walletAddress) => {
  try {
    const db = await getDatabase();
    const albums = await db.albums.find({
        selector: { owner: walletAddress },
      }).exec();
    return albums;
  } catch (error) {
    console.error(`Error getting albums for ${walletAddress}:`, error);
    throw error;
  }
};

export const updateAlbum = async (albumname, data) => {
  try {
    const db = await getDatabase();
    const album = await db.albums
      .findOne({
        selector: { albumname },
      })
      .exec();

    if (!album) {
      console.error(`Album ${albumname} not found`);
      return null;
    }

    const updatedAlbum = await album.update({ $set: data });
    return updatedAlbum;
  } catch (error) {
    console.error(`Error updating album ${albumname}:`, error);
    throw error;
  }
};

export const addNFTToAlbum = async (albumname, nftId) => {
  try {
    const db = await getDatabase();
    const album = await db.albums
      .findOne({
        selector: { albumname },
      })
      .exec();

    if (!album) {
      console.error(`Album ${albumname} not found`);
      return null;
    }

    // Prevent duplicate NFTs
    if (!album.nfts.includes(nftId)) {
      const nfts = [...album.nfts, nftId];
      const updatedAlbum = await album.update({ $set: { nfts } });
      return updatedAlbum;
    }

    return album;
  } catch (error) {
    console.error(`Error adding NFT to album ${albumname}:`, error);
    throw error;
  }
};

export const removeNFTFromAlbum = async (albumname, nftId) => {
  try {
    const db = await getDatabase();
    const album = await db.albums
      .findOne({
        selector: { albumname },
      })
      .exec();

    if (!album) {
      console.error(`Album ${albumname} not found`);
      return null;
    }

    const nfts = album.nfts.filter((nft) => nft !== nftId);
    const updatedAlbum = await album.update({ $set: { nfts } });
    return updatedAlbum;
  } catch (error) {
    console.error(`Error removing NFT from album ${albumname}:`, error);
    throw error;
  }
};
// export const addMockUser = async () => {
//   const db = await getDatabase();
//   const user = {
//     walletAddress: "0x1234567890",
//     name: "John Doe",
//     email: "kaitoaa@gmail.com",
//   };
//   const res = await db.users.insert(user);
//   console.log(res);
// };

export const testQuery = async () => {
  const db = await getDatabase();
  const users = await db.users.find().exec();
  console.log(users);
};

export async function testUploadPinata() {
  const jsonData = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: { name: "pinnie.json" },
      pinataContent: jsonData,
    }),
  };

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    );
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
}
