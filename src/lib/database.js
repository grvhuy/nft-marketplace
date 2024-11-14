import { pinata } from "../../utils/config";
import { ethers } from "ethers";
import { PGlite } from "@electric-sql/pglite";
import { IPDBABI } from "../../Context/constants";

export class IPDB {
  constructor(contractAddress, provider) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.contract = null;
    this.db = null;
  }

  async initialize() {
    // Initialize PGlite
    this.db = new PGlite("idb:nft-marketplace");

    // Initialize database schema
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS users (
        wallet_address TEXT PRIMARY KEY,
        name TEXT,
        image TEXT,
        email TEXT,
        bio TEXT,
        facebook TEXT,
        instagram TEXT,
        twitter TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS follows (
        follower_address TEXT,
        followee_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_address, followee_address),
        FOREIGN KEY (follower_address) REFERENCES users(wallet_address),
        FOREIGN KEY (followee_address) REFERENCES users(wallet_address)
      );

      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        creator_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_address) REFERENCES users(wallet_address)
      );

      CREATE TABLE IF NOT EXISTS collection_nfts (
        collection_id TEXT,
        token_id TEXT,
        contract_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (collection_id, token_id, contract_address),
        FOREIGN KEY (collection_id) REFERENCES collections(id)
      );
    `);

    // Initialize smart contract
    this.contract = new ethers.Contract(
      this.contractAddress,
      IPDBABI,
      this.provider
    );

    // Check for existing database state
    await this.syncFromIPFS();
  }

  async exportDBState() {
    const [users] = await this.db.query("SELECT * FROM users");
    const [follows] = await this.db.query("SELECT * FROM follows");
    const [collections] = await this.db.query("SELECT * FROM collections");
    const [collectionNfts] = await this.db.query(
      "SELECT * FROM collection_nfts"
    );
    return {
      users,
      follows,
      collections,
      collectionNfts,
    };
  }

  async importDBState(state) {
    // Clear existing data
    await this.db.query("DELETE FROM collection_nfts");
    await this.db.query("DELETE FROM collections");
    await this.db.query("DELETE FROM follows");
    await this.db.query("DELETE FROM users");

    // Import new data
    for (const user of state.users) {
      await this.db.query(
        "INSERT INTO users (wallet_address, name, image, email, bio, facebook, instagram, twitter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          user.wallet_address,
          user.name,
          user.image,
          user.email,
          user.bio,
          user.facebook,
          user.instagram,
          user.twitter,
        ]
      );
    }

    for (const follow of state.follows) {
      await this.db.query(
        "INSERT INTO follows (follower_address, followee_address) VALUES ($1, $2)",
        [follow.follower_address, follow.followee_address]
      );
    }

    for (const collection of state.collections) {
      await this.db.query(
        "INSERT INTO collections (id, name, description, image, creator_address) VALUES ($1, $2, $3, $4, $5)",
        [
          collection.id,
          collection.name,
          collection.description,
          collection.image,
          collection.creator_address,
        ]
      );
    }

    for (const nft of state.collectionNfts) {
      await this.db.query(
        "INSERT INTO collection_nfts (collection_id, token_id, contract_address) VALUES ($1, $2, $3)",
        [nft.collection_id, nft.token_id, nft.contract_address]
      );
    }
  }

  async syncFromIPFS() {
    try {
      const currentState = await this.contract.getState();
      if (currentState) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${currentState}`
        );
        const dbDump = await response.json();
        await this.importDBState(dbDump);
      }
    } catch (error) {
      console.error("Error syncing from IPFS:", error);
    }
  }

  async backupToIPFS(signer) {
    try {
      const dbState = await this.exportDBState();

      // Upload to IPFS via Pinata
      const result = await pinata.pinJSONToIPFS(dbState, {
        pinataMetadata: {
          name: `IPDB-Backup-${Date.now()}`,
        },
      });

      // Update smart contract with new CID
      const contract = this.contract.connect(signer);
      const tx = await contract.update(result.IpfsHash);
      await tx.wait();

      return result.IpfsHash;
    } catch (error) {
      console.error("Error backing up to IPFS:", error);
      throw error;
    }
  }

  async createUser({
    walletAddress,
    name,
    image,
    email,
    bio,
    facebook,
    instagram,
    twitter,
  }) {
    await this.db.query(
      "INSERT INTO users (wallet_address, name, image, email, bio, facebook, instagram, twitter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [walletAddress, name, image, email, bio, facebook, instagram, twitter]
    );
  }

  async testQuery() {
    const result = await this.db.query("SELECT * FROM users");
    console.log(result);
    return result;
  }
}
