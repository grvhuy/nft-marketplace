"use client";
import { getUserByWalletAddress, getUsers } from "@/lib/rxDB";
import React, { useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import AuthorCard from "../../../../components/AuthorCard";
import AuthorCollection from "../../../../components/AuthorCollection";
import AuthorFilters from "../../../../components/AuthorFilters";
import { usePathname } from "next/navigation";

const CollectionPage = () => {
  const pathname = usePathname();
  const walletAddress = pathname.split("/").pop();
  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);

  const { currentAccount, fetchMineOrListedNFTs } = React.useContext(
    NFTMarketplaceContext
  );

  const [userData, setUserData] = React.useState(null);

  useEffect(() => {
    getUsers().then((res) => {
      const user = res.find((user) => {
        const userWalletAddress = user.walletAddress.toLowerCase();
        const searchWalletAddress = walletAddress.toLowerCase();
        return userWalletAddress === searchWalletAddress;
      });

      if (user) {
        // console.log("User found:", user);
        setUserData(user._data);
      } else {
        console.warn("No matching user found");
      }
    });
    // fetchMineOrListedNFTs("listed").then((res) => {
    //   setNfts(res);
    //   console.log("listed nfts:", res);
    // });
  }, []);

  useEffect(() => {
    // fetchMineOrListedNFTs("mine").then((res) => {
    //   setMyNfts(res);
    //   console.log(res);
    // });
  }, []);

  return (
    <div className="mx-20 min-h-screen">
      {walletAddress && (
        <AuthorCard userData={userData} walletAddress={walletAddress} />
      )}
      <AuthorFilters />

      {currentAccount && currentAccount === walletAddress ? (
        <AuthorCollection nfts={myNfts} />
      ) : (
        <AuthorCollection nfts={nfts} />
      )}
    </div>
  );
};

export default CollectionPage;
