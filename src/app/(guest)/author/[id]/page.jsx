"use client";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getUserByWalletAddress,
} from "@/lib/rxDB";
import React, { useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import AuthorCard from "../../../../components/AuthorCard";
import AuthorFilters from "../../../../components/AuthorFilters";
import UserCard from "../../../../components/UserCard";
import AuthorCollection from "../../../../components/AuthorCollection";
import AuthorOwnCollection from "../../../../components/AuthorOwnCollection";
import { usePathname } from "next/navigation";

const CollectionPage = () => {
  const pathname = usePathname();
  const walletAddress = pathname.split("/").pop();
  const { currentAccount, fetchNFTs, getUserIPFSHash, fetchNFTsByOwner } =
    React.useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [filterValue, setFilterValue] = useState("Collectibles");
  const [ipfsHash, setIpfsHash] = useState(null);

  const filterArray = ["Collectibles", "Own"];

  useEffect(() => {
    if (walletAddress) {
      fetchNFTs(currentAccount).then((res) => {
        console.log("res by this address", res);
        setNfts(res);
      });
      fetchNFTsByOwner(walletAddress).then((res) => {
        console.log("res by this address", res);
        setOwnedNfts(res);
      });
    }


  }, [currentAccount, walletAddress]);

  useEffect(() => {
    const fetchUserData = async () => {
      const hash = await getUserIPFSHash(walletAddress);
      console.log("hash", hash);
      if (!hash) {
        console.warn("You have not updated your profile yet.");
      } else {
        try {
          // setIpfsHash(hash);
          const link = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${hash}`;
          const response = await fetch(link);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          // console.log("data", data);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="mx-20 min-h-screen">
      {/* Author Card */}
      {walletAddress && (
        <AuthorCard userData={userData} walletAddress={walletAddress} />
      )}

      {/* Author Filters */}

      <AuthorFilters
        onClick={(filter) => {
          console.log("filter", filter);
          if (filter === "Collectibles") {
            setFilterValue("Collectibles");
          } else if (filter === "Own") {
            setFilterValue("Own");
          }
        }}
        filterArray={filterArray}
      />
      {nfts !== 0 && filterValue === "Collectibles" && (
        <div className="">
          <AuthorCollection nfts={nfts} walletAddress={walletAddress} />
        </div>
      )}

      {filterValue === "Own" && (
        <div className="">
          <AuthorOwnCollection nfts={ownedNfts} walletAddress={walletAddress} />
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
