"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MyCollapsible from "../../../../components/MyCollapsible";

import MyButton from "@/components/custom/MyButton";

import { MoreHorizontalIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import Image from "next/image";
import { nftmarketplaceaddress } from "../../../../../Context/constants";

const NFTDetailsPage = () => {
  const tokenId = usePathname().split("/").pop();
  const router = useRouter();
  const [nft, setNft] = useState(null);

  const { fetchNFTById, currentAccount, buyNFT } = useContext(
    NFTMarketplaceContext
  );

  useEffect(() => {
    fetchNFTById(tokenId).then((res) => {
      console.log(res);
      setNft(res);
    });
  }, []);

  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg mx-20 text-white">
      {nft === null ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            {/* <img
              src={nft.image}
              alt="BearX"
              className="object-cover rounded-lg aspect-square"
            /> */}
            <Image
              src={nft.image}
              alt={nft.name}
              height={500}
              width={500}
              className={`hover:shadow-sm aspect-square block rounded-md`}
            />
            <div className="mt-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="mt-2">
                  {nft.description || "No description provided."}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <MyCollapsible
                  contractAddress={nftmarketplaceaddress}
                  tokenId={nft.tokenId}
                  tokenStandard="ERC-721"
                  chain="Base"
                />
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
                  <h2 className="text-2xl font-bold mt-1">{}</h2>
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
              <h1 className="text-2xl font-bold">{nft.name}</h1>

              <div className="flex items-center mt-2">
                <Image
                  src={nft.image}
                  alt="Creator"
                  className="w-12 h-12 rounded-full"
                  height={48}
                  width={48}
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
                  {nft.price} ETH{" "}
                  <span className="text-sm text-gray-400">(≈ $)</span>
                </b>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              {currentAccount && currentAccount === nft.seller.toLowerCase() ? (
                <button
                  disabled
                  className="max-w-60 bg-[#545455] p-6 font-bold mt-8 rounded-xl "
                >
                  You are the owner of this NFT
                </button>
              ) : currentAccount == nft.owner.toLowerCase() ? (
                <MyButton onClick={
                  () => {
                    router.push(`/assets/resell/${nft.tokenId}`);
                  }
                } title="List On Marketplace" />
              ) : (
                <MyButton
                  onClick={() => {
                    buyNFT(nft).then(
                      () => {
                        window.location.reload();
                      }
                    )
                  }}
                  title="Buy NFT"
                />
              )}
              <MyButton title="Make Offer" />
            </div>
            <div className="mt-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => {}}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
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
                    {/* <img
                      src={testURL}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    /> */}
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
      )}
    </div>
  );
};

export default NFTDetailsPage;
