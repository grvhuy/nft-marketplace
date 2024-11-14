import { PGlite } from "@electric-sql/pglite";
import { pinata } from "../../utils/config";
import { ethers } from "ethers";

// const provider = new ethers.providers.Web3Provider(window.ethereum)
// const signer = provider.getSigner();
// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const contractABI = "abi";
// const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const initDB = async () => {
  const db = new PGlite('idb://nft-marketplace');
  // await db.query("select 'Hello world' as message;")
  // Users table
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      wallet_address TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      bio TEXT,
      image_url TEXT,
      facebook_link TEXT,
      instagram_link TEXT,
      twitter_link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Followers table
  await db.query(`
    CREATE TABLE IF NOT EXISTS followers (
      follower_id TEXT REFERENCES users(id),
      following_id TEXT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (follower_id, following_id)
    );
  `);

  // Collections table
  await db.query(`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // NFTs in collections table
  await db.query(`
    CREATE TABLE IF NOT EXISTS collection_nfts (
      collection_id TEXT REFERENCES collections(id),
      nft_contract TEXT NOT NULL,
      token_id TEXT NOT NULL,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (collection_id, nft_contract, token_id)
    );
  `);

  // Notifications table

  const file = (await db.dumpDataDir("auto"))
  const upload = await pinata.upload.file(file);
  // const ipfsHash = upload.IpfsHash;
  
  // const tx = await contract.update(ipfsHash);
  // console.log("Transaction Hash: ", tx.hash);

  // const receipt = await tx.wait();
  // console.log("Transaction Receipt: ", receipt);
  // return db;
};


