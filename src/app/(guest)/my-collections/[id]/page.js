"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthorCard from "@/components/AuthorCard";
import {
  getAlbums,
  getAlbumsByOwnerAddress,
  getUsers,
} from "../../../../lib/rxDB";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import CollectionCard from "@/components/home-page/CollectionCard";

const CollectionPages = () => {
  const pathname = usePathname();
  const walletAddress = pathname.split("/").pop();

  const { currentAccount, fetchMineOrListedNFTs } = React.useContext(
    NFTMarketplaceContext
  );
  const [isReady, setIsReady] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [albums, setAlbums] = React.useState([]);

  useEffect(() => {
    if (walletAddress && currentAccount) {
      setIsReady(true);
    }
  }, [walletAddress, currentAccount]);

  useEffect(() => {
    async function fetchData() {
      if (isReady) {
        try {
          // Fetch user data
          const res = await getUsers();
          const user = res.find((user) => {
            const userWalletAddress = user.walletAddress.toLowerCase();
            return userWalletAddress === walletAddress.toLowerCase();
          });

          if (user) {
            console.log("user", user);
            setUserData(user._data);
          } else {
            console.warn("No matching user found");
          }

          // Fetch albums
          const albums = await getAlbumsByOwnerAddress(currentAccount);
          console.log("getAlbumsByOwnerAddress", albums);
          setAlbums(albums);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    }

    fetchData();
  }, [isReady]);

  return (
    <div className="mx-20 min-h-screen">
      {currentAccount && (
        <AuthorCard userData={userData} walletAddress={currentAccount} />
      )}

      {albums.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {albums.map((album, index) => (
            <CollectionCard
              key={index}
              image={album._data.image}
              name={album._data.albumname}
              description={album._data.desscript}
              owner={album._data.owner}
              nfts={album._data.nfts}
            />
          ))}
        </div>
      )}
      {!albums.length && <div>No albums found</div>}
    </div>
  );
};

export default CollectionPages;
