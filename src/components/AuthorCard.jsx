"use client"
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import {
  Copy,
  Facebook,
  FacebookIcon,
  LucideFacebook,
  Youtube,
} from "lucide-react";
import React, { useState } from "react";
import MyButton2 from "../components/custom/MyButton2";

const testURL =
  "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/462534232_1052853119969676_1093995911813386268_n.png?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEl1Qfs58HCWe2vceHG4g-mPXxybZtGEkQ9fHJtm0YSRGKSih6lL5jXoclQU3lkdGSA1Hn845yjjv6oQRBI2Fc2&_nc_ohc=4EbyBoIIdFAQ7kNvgEi68R7&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AhB9PvgR8Gn3nVDNfCJZGg6&oh=03_Q7cD1QF0WIPIJ7_PmHR1xjGbVTmY2m5MUe9rl4xca8bcUNvQhw&oe=67300766";

const AuthorCard = () => {

  const [address, setAddress] = useState("0x829BD824B03D092233...A830");

  return (
    <div className="bg-[#2f2e2e] rounded-lg shadow-lg p-6 flex items-center space-x-4 mt-4">
      <img
        src={testURL}
        alt="Author"
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-grow">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Dony Herrera</h2>
            <span className="text-blue-500">✔️</span>
          </div>
          <div className="flex space-x-2">
            <MyButton2 title="Follow" />
            <MyButton2 title="Upload" />
          </div>
        </div>
        <p className="text-white mt-1 flex items-center">
          {address}
          <span>
            <Copy
              onClick={() => {
                // copy address to clipboard
                navigator.clipboard.writeText(address);
              }}
            className="w-4 h-4 ml-1 text-white transform transition-transform duration-200 hover:scale-95 hover:text-[#8e42da] cursor-pointer" />
          </span>
        </p>
        <p className="text-white mt-2">
          Punk #4786 / An OG Cryptopunk Collector, hoarder of NFTs. Contributing
          to @ether_cards, an NFT Monetization Platform.
        </p>
        <div className="flex space-x-4 mt-3">
          <InstagramLogoIcon className="w-6 h-6 transform transition-transform duration-200 hover:scale-95 hover:text-[#ed8800] text-white" />
          <LinkedInLogoIcon className="w-6 h-6 transform transition-transform duration-200 hover:scale-95 hover:text-[#1362bf] text-white" />
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
