"use client";

import MyCollapsible from "@/components/MyCollapsible";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nftmarketplaceaddress } from "../../../../../../Context/constants";
import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../../../Context/NFTMarketplaceContext";
import MyButton from "@/components/custom/MyButton";
import Spinner from "@/components/Spinner";
import Link from "next/link";

const ResellPage = () => {
  const tokenId = usePathname().split("/").pop();

  const [sellType, setSellType] = useState("fixed-price");

  const [nft, setNft] = useState(null);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  // const [reversePrice, setReversePrice] = useState(0);

  const { fetchNFTById, createSale, startAuction, fetchAuction } = useContext(
    NFTMarketplaceContext
  );

  useEffect(() => {
    fetchNFTById(tokenId).then((res) => {
      console.log(res);
      setNft(res);
      setPrice(res.price);
    });
  }, []);

  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg mx-20 text-white min-h-screen">
      <h1 className="text-purple-400 font-bold text-5xl mt-2 mb-16">
        Set Your Price and Resell Your Token
      </h1>

      {!nft ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            {/* <img
                src={nft.image}
                alt="BearX"
                className="object-cover rounded-lg aspect-square"
              /> */}
            <Link href={`/assets/${nft.tokenId}`}>
              <Image
                src={nft.image}
                alt={nft.name}
                height={500}
                width={500}
                className={`hover:shadow-sm aspect-square block rounded-md`}
              />
            </Link>
          </div>
          <div className="flex flex-col justify-start">
            <div className="space-y-4 my-4">
              <h2 className="text-2xl font-bold">Choose a type of sale</h2>
              <div
                onClick={() => setSellType("fixed-price")}
                className={`flex p-2 justify-between items-center space-x-2 rounded-md ${
                  sellType === "fixed-price" ? "border bg-[#202938]" : ""
                }`}
              >
                <label className="font-medium">
                  Fixed price
                  <div className="text-gray-500">
                    The item is listed at the price you set.
                  </div>
                </label>
                <input
                  type="radio"
                  name="sale-type"
                  value="fixed_price"
                  checked={sellType === "fixed-price"}
                  onChange={() => setSellType("fixed-price")}
                  className="form-radio text-indigo-600 size-6 bg-indigo-600"
                />
              </div>
              <div
                onClick={() => setSellType("auction")}
                className={`flex p-2 justify-between items-center space-x-2 rounded-md ${
                  sellType === "auction" ? "border bg-[#202938]" : ""
                }`}
              >
                <label className="font-medium">
                  Start An Auction
                  <div className="text-gray-500">
                    The item is listed for auction.{" "}
                  </div>
                </label>
                <input
                  type="radio"
                  name="sale-type"
                  value="auction"
                  checked={sellType === "auction"}
                  onChange={() => {
                    setSellType("auction");
                  }}
                  className="form-radio text-indigo-600 size-6"
                />
              </div>
            </div>

            <div>
              <div>
                {sellType === "auction" ? (
                  <div>
                    <label className="block text-white text-sm font-medium mt-4">
                      Starting Price
                    </label>
                    <input
                      type="number"
                      name="minPrice"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1 block text-black w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    />

                    <label className="block text-white text-sm font-medium mt-4">
                      Duration (By Seconds)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="mt-1 block text-black w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    />

                    {/* <label className="block text-white text-sm font-medium mt-4">
                      Reverse Price
                    </label>
                    <input
                      type="number"
                      name="reversePrice"
                      value={reversePrice}
                      onChange={(e) => setReversePrice(e.target.value)}
                      className="mt-1 block text-black w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    /> */}
                  </div>
                ) : (
                  <div>
                    <label className="block text-white text-sm font-medium ">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1 block text-black w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {sellType === "auction" ? (
                <MyButton
                  title="Start Auction"
                  onClick={() => {
                    console.log({
                      tokenId: nft.tokenId,
                      price,
                      duration,
                    });
                    startAuction(nft.tokenId, price, duration);
                  }}
                />
              ) : (
                <MyButton
                  title="Resell"
                  onClick={() => {
                    createSale(nft.tokenId, price, true);
                  }}
                />
              )}
            </div>
            <div className="mt-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="mt-2">
                  {nft.description || "No description provided."}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <MyCollapsible
                  contractAddress={nftmarketplaceaddress}
                  tokenId={tokenId}
                  tokenStandard="ERC-721"
                  chain="Base"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellPage;
