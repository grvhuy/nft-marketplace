"use client";

import React, { useState } from "react";
const UserCard = (props) => {
  return (
    <div className="flex items-center space-x-4 my-4 cursor-pointer">
      {props.profileImage ? (
        <img
          src={props.profileImage}
          alt="User"
          className="w-24 h-24 object-cover rounded-lg"
        />
      ) : (
        <img
          src="https://placehold.co/400"
          alt="User"
          className="w-24 h-24 object-cover rounded-lg"
        />
      )}
      <div>
        <h4 className="text-lg font-semibold text-white">{props.name}</h4>
        <p className="text-sm text-gray-400">{props.walletAddress}</p>
      </div>
    </div>
  );
};
export default UserCard;
