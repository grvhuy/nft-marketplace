"use client";
import {
  followUser,
  unfollowUser
} from "@/lib/rxDB";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import {
  Copy,
  FacebookIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import NFTMarketplaceContext from "../../Context/NFTMarketplaceContext";
import MyButton2 from "../components/custom/MyButton2";

const testURL = "https://placehold.co/400";

const AuthorCard = (props) => {
  const address = usePathname().split("/").pop();
  const { currentAccount } = React.useContext(NFTMarketplaceContext);
  const [followed, setFollow] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleFollow = async () => {
    followUser(currentAccount, props.walletAddress).then((res) => {
      console.log("followUser", res);
      setFollow(true);
    });
  };

  const handleUnfollow = async () => {
    unfollowUser(currentAccount, props.walletAddress).then((res) => {
      console.log("unfollowUser", res);
      setFollow(false);
    });
  };

  useEffect(() => {
    // if (currentAccount) {
    //   const checkFollowed = async () => {
    //     if (currentAccount === props.walletAddress) {
    //       return;
    //     }
    //     const isFollowed = await checkFollow(
    //       currentAccount,
    //       props.walletAddress
    //     );
    //     console.log("isFollowed", isFollowed);
    //     setFollow(isFollowed);
    //   };
    //   checkFollowed();
    // }
  }, [currentAccount]);

  return (
    <div className="bg-[#2f2e2e] rounded-lg shadow-lg p-6 flex items-center space-x-4 mt-4">
      <img
        src={
          props.userData?.profileImage
            ? props.userData.profileImage
            : "https://placehold.co/400"
        }
        alt="Author"
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-grow">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">
              {props.userData?.name || "Anonymous User"}
            </h2>
            {/* <span className="text-blue-500">✔️</span> */}
          </div>
          <div className="flex space-x-2">
            {followed ? (
              <MyButton2 onClick={handleUnfollow} title="Following ✔️" />
            ) : (
              <MyButton2 onClick={handleFollow} title="Follow" />
            )}
            <MyButton2 title="Upload" />
          </div>
        </div>
        <p className="text-white mt-1 flex items-center">
          {props.walletAddress}
          <span>
            <Copy
              onClick={() => {
                // copy address to clipboard
                navigator.clipboard.writeText(address);
              }}
              className="w-4 h-4 ml-1 text-[#b886eb] transform transition-transform duration-200 hover:scale-95 hover:text-[#8e42da] cursor-pointer"
            />
          </span>
        </p>
        <p className="text-white mt-2">
          {props.userData?.bio || "This person has no bio"}
        </p>
        <div className="flex space-x-4 mt-3">
          <Link href={props.userData?.socials?.facebook || "#"} target="_blank">
            <InstagramLogoIcon className="w-6 h-6 transform transition-transform duration-200 hover:scale-95 hover:text-[#ed8800] text-white" />
          </Link>
          <LinkedInLogoIcon
            href={props.userData?.socials?.linkedin || "#"}
            className="w-6 h-6 transform transition-transform duration-200 hover:scale-95 hover:text-[#1362bf] text-white"
          />
          <FacebookIcon
            href={props.userData?.socials?.facebook || "#"}
            className="w-5 h-5 transform transition-transform duration-200 hover:scale-95 hover:text-[#4267b2] text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
