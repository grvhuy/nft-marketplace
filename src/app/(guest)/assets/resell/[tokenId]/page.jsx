"use client";

import MyCollapsible from "@/components/MyCollapsible";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nftmarketplaceaddress } from "../../../../../../Context/constants";
import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../../../Context/NFTMarketplaceContext";
import MyButton from "@/components/custom/MyButton";

const ResellPage = () => {
  const tokenId = usePathname().split("/").pop();

  const [nft, setNft] = useState(null);
  const [price, setPrice] = useState(0);

  const { fetchNFTById, createSale } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    fetchNFTById(tokenId).then((res) => {
      console.log(res);
      setNft(res);
      setPrice(res.price);
    });
  }, []);

  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg mx-20 text-white min-h-screen">
      <h1 className="text-purple-400 font-bold text-5xl mt-2 mb-16">Set Your Price and Resell Your Token</h1>

      {!nft ? (
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
          </div>
          <div className="flex flex-col justify-start">
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

              <MyButton
                title="Resell"
                onClick={() => {
                  createSale(nft.tokenId, price, true);
                }}
              />
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
