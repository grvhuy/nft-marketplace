"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { Button } from "./ui/button";

const NFTCard = ({ tokenId, image, name, timeLeft, price }) => {
  useEffect(() => {
    console.log("NFTCard", tokenId, image, name, timeLeft, price);
  }, []);

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/assets/${tokenId}`)}
      className="bg-slate-300 rounded-lg shadow-lg p-4 w-64 mt-4 transform transition-transform duration-200 hover:scale-95 cursor-pointer"
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-white p-1 rounded-full">
          <Image
            src={image}
            alt="icon"
            className="w-4 h-4"
            fill
            sizes="100vw"
          />
        </div>
        {/* <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
          <span className="text-sm"> ❤️</span>
        </div> */}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mt-2">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div className="mt-4 w-1/2">
            <p className="text-lg border-[1.5px] border-gray-400 p-2 relative items-center justify-center flex">
              <span className="bg-[#ac8be0] text-white p-1 rounded-sm block text-sm absolute -top-5">
                Current Bid
              </span>
              <b className="">{price} ETH</b>
            </p>
          </div>
          <div className="text-sm text-gray-500">{timeLeft} left</div>
        </div>
      </div>
    </div>
  );
};

const AuthorCollection = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    console.log("AuthorCollection", props.nfts);
    // console.log("wallet", props.walletAddress);
  }, [props]);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (!props.nfts) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 overflow-x-auto p-4">
        <Spinner />
      </div>
    );
  }

  const filteredNFTs = props.nfts.filter(
    (nft) => nft.seller.toLowerCase() == props.walletAddress.toLowerCase()
  );

  const totalItems = filteredNFTs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 overflow-x-auto">
        {paginatedNFTs.map((nft, index) => {
          return (
            <NFTCard
              key={index}
              tokenId={nft.tokenId}
              image={nft.image}
              name={nft.name}
              timeLeft={nft.timeLeft}
              price={nft.price}
            />
          );
        })}
      </div>

      {props.nfts.length > 8 && (
        <div className="flex justify-center items-center mt-32">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md mx-2 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </Button>
          <span className="mx-2 text-white">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md mx-2 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthorCollection;
