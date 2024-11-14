"use client";

import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import { ethers } from "hardhat";
import { checkIndexedDB } from "../../../lib/checkIndexedDB";
import { pinata } from "../../../../utils/config";
import { PGlite } from "@electric-sql/pglite";
import { initDB } from "../../../lib/initDB";

export default function TestPage() {
  const { fetchNFTsByIds, fetchNFTs } = useContext(NFTMarketplaceContext);
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // async function importDb() {
  //   try {
  //     //  Set up the Web3 provider
  //     const provider = new ethers.providers.JsonRpcProvider()
  //     // Create a contract instance
  //     const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", "abi", provider);

  //     // Call the contract
  //     const dbCid = await contract.getState()
  //     console.log("DB CID: ", dbCid)

  //     // check if indexed db exist
  //     // if not create one
  //     const dbExists = checkIndexedDB("nft_marketplace");

  //     if (!dbExists) {
  //       // If the database doesn't exist locally, fetch it from Pinata (IPFS)
  //       const dbFile = await pinata.gateways.get(dbCid)
  //       const file = dbFile.data
  //       db = new PGlite({
  //         loadDataDir: file,
  //         dataDir: "auto",
  //       })

  //       console.log("DB Imported: ", db)
  //     } else {
  //       initDB();
  //     }

  //   } catch (error) {

  //   }
  // }

  // useEffect(() => {
  //   initDB();
  // }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Hello</h1>
      <button>fetch nft by ids</button>
    </div>
  );
}
