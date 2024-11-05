"use client";

import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../Context/NFTMarketplaceContext";

function Timer({ endTimeHex, tokenId }) {
  const { endAuction } = useContext(NFTMarketplaceContext);

  const [isEnded, setIsEnded] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const endTime = ethers.BigNumber.from(endTimeHex).toNumber();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - Math.floor(Date.now() / 1000);
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (60 * 60 * 24)),
          hours: Math.floor((difference / (60 * 60)) % 24),
          minutes: Math.floor((difference / 60) % 60),
          seconds: Math.floor(difference % 60),
        });
      } else {
        setIsEnded(true);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="mt-4">
      <span className="block text-gray-400">Auction ending in:</span>
      <div className="grid grid-cols-4 gap-2 mt-1">
        <div className="text-center">
          <span className="block text-5xl font-bold">{timeLeft.days}</span>
          <span className="text-sm text-gray-400">Days</span>
        </div>
        <div className="text-center">
          <span className="block text-5xl font-bold">{timeLeft.hours}</span>
          <span className="text-sm text-gray-400">Hours</span>
        </div>
        <div className="text-center">
          <span className="block text-5xl font-bold">{timeLeft.minutes}</span>
          <span className="text-sm text-gray-400">Mins</span>
        </div>
        <div className="text-center">
          <span className="block text-5xl font-bold">{timeLeft.seconds}</span>
          <span className="text-sm text-gray-400">Secs</span>
        </div>
      </div>

      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
        <button
          onClick={() => endAuction(tokenId)}
          className="bg-purple-500 text-white rounded-md py-2 px-4 mt-2"
        >
          End Auction
        </button>
      )}
    </div>
  );
}

export default Timer;
