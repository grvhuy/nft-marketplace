"use client";

import React, { useEffect } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import { usePathname } from "next/navigation";
import AuthorCard from "@/components/AuthorCard";
import { getAlbums, getAlbumsByOwnerAddress, getUsers } from "@/lib/rxDB";

const CollectionPages = () => {
  const { currentAccount, fetchMineOrListedNFTs } = React.useContext(
    NFTMarketplaceContext
  );

  const [userData, setUserData] = React.useState(null);
  useEffect(() => {
    async function fetchAlbums() {
      if (currentAccount) {
        try {
          const res = await getAlbumsByOwnerAddress(currentAccount);
          console.log("getAlbumsByOwnerAddress", res);
        } catch (err) {
          console.error("Failed to fetch albums:", err);
        }
      }
    }

    fetchAlbums();
  }, [currentAccount]);

  useEffect(() => {
    async function fetchUserData() {
      if (currentAccount) {
        try {
          const res = await getUsers();
          const user = res.find((user) => {
            const userWalletAddress = user.walletAddress.toLowerCase();
            const searchWalletAddress = currentAccount.toLowerCase();
            return userWalletAddress === searchWalletAddress;
          });

          if (user) {
            console.log("user", user);
            setUserData(user._data);
          } else {
            console.warn("No matching user found");
          }
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      }
    }

    fetchUserData();
  }, [currentAccount]);

  return (
    <div className="mx-20 min-h-screen">
      {currentAccount && (
        <AuthorCard userData={userData} walletAddress={currentAccount} />
      )}
    </div>
  );
};

export default CollectionPages;
