"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { shortenAddress } from "../../utils/convert";
import { Copy } from "lucide-react";
import Link from "next/link";

const UserCard = (props) => {
  const router = useRouter();

  return (
    <div className="bg-[#eef1fc] flex flex-col  rounded-lg h-full transform transition-all duration-200 hover:scale-105">
      <div className="flex flex-col items-center cursor-pointer">
        {props.profileImage ? (
          <img
            src={props.profileImage}
            alt="User"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        ) : (
          <img
            src={`
            https://placehold.co/800x400
            `}
            alt="User"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        )}
        <p onClick={() => router.push(`/author/${props.walletAddress}`)}>
          <span className="text-lg font-semibold text-black line-clamp-1">
            {props.name}
          </span>
          <span className="flex items-center  text-sm text-black">
            {shortenAddress(props.walletAddress)}
            <span>
              <Copy
                className="w-4 h-4 text-gray-700 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(props.walletAddress);
                }}
              />
            </span>
          </span>
        </p>
        <button 
          className="bg-[#ac8be0] text-white w-full rounded-b-lg py-2 font-bold mt-2"
        >
          <Link href={`/author/${props.walletAddress}`}>View Profile</Link>
        </button>
      </div>
    </div>
  );
};
export default UserCard;
