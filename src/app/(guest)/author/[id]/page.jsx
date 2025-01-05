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
import { usePathname } from "next/navigation";

const CollectionPage = () => {
  const pathname = usePathname();
  const walletAddress = pathname.split("/").pop();
  const { currentAccount, fetchNFTs, fetchMineOrListedNFTs } = React.useContext(
    NFTMarketplaceContext
  );


  
  const [nfts, setNfts] = useState([]);
  const [ownedNfts, setOwnedNfts] = useState([]);
  // const [myNfts, setMyNfts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [filterValue, setFilterValue] = useState("Collectibles");

  const filterArray = ["Collectibles", "Created", "Following", "Followers"];

  // Fetch user data and follower/following lists
  useEffect(() => {
    if (currentAccount) {
      getFollowers(walletAddress).then((res) => {
        setFollowers(res.followers);
        setFollowing(res.following);
        if (res.user) {
          setUserData(res.user._data);
        }
        console.log("user", res.user);

        const userIsFollowing = res.followers.some(
          (follower) => follower._data.walletAddress === currentAccount
        );
        setIsFollowing(userIsFollowing);
      });
    }
  }, [currentAccount, walletAddress]);

  useEffect(() => {
    // fetchMineOrListedNFTs("listed").then((res) => {
    //   setNfts(res);
    //   console.log("listed nfts:", res);
    // });
    if (walletAddress) {
      fetchNFTs().then((res) => {
        setNfts(res)
      });
    }
  }, [
    currentAccount,
    walletAddress,
  ]);

  // Handle follow action
  const handleFollow = async () => {
    try {
      await followUser(currentAccount, walletAddress);
      setIsFollowing(true);
      setFollowers((prev) => [
        ...prev,
        { _data: { walletAddress: currentAccount } },
      ]); // Add current user to followers list
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(currentAccount, walletAddress);
      setIsFollowing(false);
      setFollowers((prev) =>
        prev.filter((f) => f._data.walletAddress !== currentAccount)
      ); // Remove current user from followers list
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="mx-20 min-h-screen">
      {/* Author Card */}
      {walletAddress && (
        <AuthorCard
          userData={userData}
          walletAddress={walletAddress}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      )}

      {/* Author Filters */}

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


      {nfts && filterValue === "Collectibles" && (
        <div className="">
          <AuthorCollection nfts={nfts} walletAddress={walletAddress} />
        </div>
      )}

      {filterValue === "Following" && (
        <div className="grid grid-cols-1 md:grid-cols-5 space-x-4 overflow-x-auto p-4">
          {following.map((follower) => (
            <UserCard
              key={follower._data.walletAddress}
              profileImage={follower._data.profileImage}
              name={follower._data.name}
              walletAddress={follower._data.walletAddress}
            />
          ))}
        </div>
      )}

      {/* Example Followers Display */}
      {filterValue === "Followers" && (
        <div className="grid grid-cols-1 md:grid-cols-5 space-x-4 overflow-x-auto p-4">
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
    </div>
  );
};

export default CollectionPage;