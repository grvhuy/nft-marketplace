"use client";

import React, { useEffect } from "react";
import NFTMarketplaceContext from "../../Context/NFTMarketplaceContext";
import Link from "next/link";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon } from "lucide-react";

const AuthorCard = ({
  userData,
  walletAddress,
  // isFollowing,
  // onFollow,
  // onUnfollow,
}) => {
  const { currentAccount } = React.useContext(NFTMarketplaceContext);
  // const [loading, setLoading] = React.useState(false);

  // useEffect(() => {
  //   console.log("userData in child section", userData);
  // }, [userData]);

  return (
    <div className="bg-[#2f2e2e] rounded-lg shadow-lg p-6 flex items-center space-x-4 mt-4">
      {userData && userData.profileImage ? (
        <img
          src={userData?.profileImage}
          alt="Author"
          className="w-24 h-24 object-cover rounded-lg"
        />
      ) : (
        <img
          src="https://placehold.co/400"
          alt="Author"
          className="w-24 h-24 object-cover rounded-lg"
        />
      )}
      <div className="flex-grow">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">
              {userData?.name || "Anonymous User"}
            </h2>
          </div>
          {/* {walletAddress !== currentAccount && (
            <div className="flex space-x-2">
              {isFollowing ? (
                <button
                  onClick={onUnfollow}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  Following ✔️
                </button>
              ) : (
                <button
                  onClick={onFollow}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Follow
                </button>
              )}
            </div>
          )} */}
        </div>
        <p className="text-white mt-2">{userData?.bio || "No bio."}</p>
        {userData && (
          <div className="flex space-x-4 mt-3">
            <Link href={userData?.facebookLink || "#"} target="_blank">
              <InstagramLogoIcon className="w-6 h-6 transform transition-transform duration-200 hover:scale-95 hover:text-[#ed8800] text-white" />
            </Link>
            <Link href={userData?.linkedinLink || "#"} target="_blank">
              <LinkedInLogoIcon className="w-6 h-6 transform transition-transform duration-200 hover:scale-95 hover:text-[#1362bf] text-white" />
            </Link>
            <Link href={userData?.facebookLink || "#"} target="_blank">
              <FacebookIcon className="w-5 h-5 transform transition-transform duration-200 hover:scale-95 hover:text-[#4267b2] text-white" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;
