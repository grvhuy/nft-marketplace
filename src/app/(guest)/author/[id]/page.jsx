"use client";
import {
  getFollowers,
  getFollowing,
  getUserByWalletAddress,
  getUsers,
} from "@/lib/rxDB";
import React, { useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import AuthorCard from "../../../../components/AuthorCard";
import AuthorCollection from "../../../../components/AuthorCollection";
import AuthorFilters from "../../../../components/AuthorFilters";
import UserCard from "../../../../components/UserCard";
import { usePathname } from "next/navigation";

const CollectionPage = () => {
  const pathname = usePathname();
  const walletAddress = pathname.split("/").pop();
  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const filterArray = [
    "Collectibles",
    "Created",
    "Liked",
    "Following",
    "Followers",
  ];
  const [filterValue, setFilterValue] = useState("Collectibles");
  const { currentAccount, fetchMineOrListedNFTs } = React.useContext(
    NFTMarketplaceContext
  );

  const [userData, setUserData] = React.useState(null);
  const [followers, setFollowers] = React.useState([]);
  const [following, setFollowing] = React.useState([]);

  useEffect(() => {
    // getUsers().then((res) => {
    //   console.log("users", res);
    //   const user = res.find((user) => {
    //     const userWalletAddress = user.walletAddress.toLowerCase();
    //     const searchWalletAddress = walletAddress.toLowerCase();
    //     return userWalletAddress === searchWalletAddress;
    //   });

    //   if (user) {
    //     setUserData(user._data);
    //     console.log("user", user._data);
    //   } else {
    //     console.warn("No matching user found");
    //   }
    // });

    fetchMineOrListedNFTs("listed").then((res) => {
      setNfts(res);
      console.log("listed nfts:", res);
    });
    // fetchMineOrListedNFTs("mine").then((res) => {
    //   setMyNfts(res);
    //   console.log("mine nfts:", res);
    // });
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getFollowers(walletAddress).then((res) => {
        setFollowers(res.followers);
        setFollowing(res.following);
        console.log("followers", res);
      });
    }
  }, [currentAccount]);



  return (
    <div className="mx-20 min-h-screen">
      {walletAddress && (
        <AuthorCard userData={userData} walletAddress={walletAddress} />
      )}
      <AuthorFilters
        onClick={(filter) => {
          console.log("filter", filter);
          if (filter === "Collectibles") {
            // setNfts(myNfts);
            setFilterValue("Collectibles");
          } else if (filter === "Created") {
            // fetchMineOrListedNFTs("listed").then((res) => {
            //   setNfts(res);
            // });
            setFilterValue("Created");
          } else if (filter === "Liked") {
            setFilterValue("Liked");
            // setNfts([]);
          } else if (filter === "Following") {
            setFilterValue("Following");
            // setNfts([]);
          } else if (filter === "Followers") {
            setFilterValue("Followers");
            // setNfts([]);
          }
        }}
        filterArray={filterArray}
      />

      {/* {filterValue === "Collectibles" &&
      currentAccount &&
      currentAccount === walletAddress ? (
        <AuthorCollection nfts={nfts} />
      ) : (
        <AuthorCollection nfts={nfts} />
      )} */}

      {filterValue === "Collectibles" && <AuthorCollection nfts={nfts} />}

      {filterValue === "Followers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-x-auto p-4">
          {followers.map((follower) => (
            <UserCard
              key={follower._data.walletAddress}
              profileImage={follower._data.profileImage}
              name={follower._data.name}
              walletAddress={follower._data.walletAddress}
            />
          ))}
          {followers.map((follower) => (
            <UserCard
              key={follower._data.walletAddress}
              profileImage={follower._data.profileImage}
              name={follower._data.name}
              walletAddress={follower._data.walletAddress}
            />
          ))}
          {followers.map((follower) => (
            <UserCard
              key={follower._data.walletAddress}
              profileImage={follower._data.profileImage}
              name={follower._data.name}
              walletAddress={follower._data.walletAddress}
            />
          ))}
        </div>
      )}
      {filterValue === "Following" && (
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-x-auto p-4">
          {following.map((following) => (
            <UserCard
              key={following._data.walletAddress}
              profileImage={following._data.profileImage}
              name={following._data.name}
              walletAddress={following._data.walletAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
