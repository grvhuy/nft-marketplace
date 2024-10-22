import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import MyButton from "@/components/custom/MyButton";

import { MoreHorizontalIcon } from "lucide-react";
const testURL =
  "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/462534232_1052853119969676_1093995911813386268_n.png?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEl1Qfs58HCWe2vceHG4g-mPXxybZtGEkQ9fHJtm0YSRGKSih6lL5jXoclQU3lkdGSA1Hn845yjjv6oQRBI2Fc2&_nc_ohc=4EbyBoIIdFAQ7kNvgEi68R7&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AhB9PvgR8Gn3nVDNfCJZGg6&oh=03_Q7cD1QF0WIPIJ7_PmHR1xjGbVTmY2m5MUe9rl4xca8bcUNvQhw&oe=67300766";

const NFTDetailsPage = () => {
  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg mx-20 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <img
            src={testURL}
            alt="BearX"
            className="object-cover rounded-lg aspect-square"
          />
          <div className="mt-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="mt-2">
                This is a detailed description of the item, highlighting its
                unique features and value.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold">Details</h3>
              <p className="mt-2">
                Additional details about the item, including specifications and
                other relevant information.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <div className="flex justify-between">
              <div>
                <span className="block text-sm text-gray-400">
                  Virtual Worlds
                </span>
                <h2 className="text-2xl font-bold mt-1">BearX #23453</h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontalIcon className="text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Price</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Transfer</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
            <div className="flex items-center mt-2">
              <img
                src={testURL}
                alt="Creator"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col">
                <p className="ml-2">Creator</p>
                <b className="ml-2">Karil Costa</b>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-gray-400">Auction ending in:</span>
            <div className="grid grid-cols-4 gap-2 mt-1">
              <div className="text-center">
                <span className="block text-xl font-bold">2</span>
                <span className="text-sm text-gray-400">Days</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold">22</span>
                <span className="text-sm text-gray-400">Hours</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold">45</span>
                <span className="text-sm text-gray-400">Mins</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold">12</span>
                <span className="text-sm text-gray-400">Secs</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Current Bid</span>
              <b className="text-2xl font-bold">
                1.000 ETH{" "}
                <span className="text-sm text-gray-400">(≈ $3,221.22)</span>
              </b>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <MyButton title="Place a bid" /> 
            <MyButton title="Make Offer" />
          </div>
          <div className="mt-6">
            <div className="flex space-x-4">
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                Bid History
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                Provenance
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                Owner
              </button>
            </div>
            <div className="mt-4">
              <div className="border-t border-gray-600 py-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={testURL}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <span>Offer by $770</span>
                    <div className="text-sm text-gray-400">
                      June 14 - 4:12 PM
                    </div>
                  </div>
                </div>
              </div>
              {/* Repeat the above block for more offers */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailsPage;
