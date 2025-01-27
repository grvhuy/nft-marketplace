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
import { convertToUSD } from "../../../../../utils/convert";

import MyCollapsible from "../../../../components/MyCollapsible";
import Timer from "../../../../components/Timer";

import MyButton from "@/components/custom/MyButton";

import { Copy, MoreHorizontalIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import Image from "next/image";
import {
  contractOwner,
  nftmarketplaceaddress,
} from "../../../../../Context/constants";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { ethers } from "ethers";
import AuctionDialog from "../../../../components/AuctionDialog";
import NFTTransactionChart from "../../../../components/NFTTransactionChart";
import { searchNFTInfo } from "../../../../../utils/explorerHelpers";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../lib/redux/feature/slice/cart";

const NFTDetailsPage = () => {
  const tokenId = usePathname().split("/").pop();
  const router = useRouter();
  useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [nft, setNft] = useState(null);
  const [auction, setAuction] = useState(null);
  const [priceInEth, setPriceInEth] = useState(0);
  const [history, setHistory] = useState(null);

  const {
    fetchNFTById,
    currentAccount,
    buyNFT,
    fetchAuction,
    placeBid,
    getUserIPFSHash,
  } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await searchNFTInfo(tokenId);
      setHistory(data);
      console.log("history", data);
    };

    console.log("auction :", auction);
    fetchNFTById(tokenId).then((res) => {
      console.log(res);
      setNft(res);
    });
    fetchAuction(tokenId).then((res) => {
      if (res == null) return;
      if (res) {
        setAuction(res);
        console.log(res);
        setPriceInEth(
          ethers.utils.formatEther(ethers.BigNumber.from(res.highestBid))
        );
      }
    });
    fetchHistory();
  }, []);

  const handleBuyNFT = async () => {
    if (!nft || !nft.price) {
      console.error("NFT or price is not available.");
      return;
    }
    try {
      await buyNFT(nft);
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg mx-20 min-h-screen text-white">
      {nft === null ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
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
                width={600} // Thay đổi giá trị này theo thiết kế
                height={500}
                objectFit="cover"
                priority
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
                    {nft.owner.toLowerCase() ===
                      nftmarketplaceaddress.toLowerCase() && (
                      <>
                        <p className="ml-2 font-bold">Seller</p>
                        <b className="ml-2">
                          <a
                            target="_blank"
                            href={`/author/${nft.seller}`}
                            className="text-blue-500"
                          >
                            {nft.seller}
                          </a>
                        </b>
                      </>
                    )}

                    { nft.seller === "0x0000000000000000000000000000000000000000" && (
                       <>
                       <p className="ml-2 font-bold">Owner</p>
                       <b className="ml-2">
                         <a
                           target="_blank"
                           href={`/author/${nft.owner}`}
                           className="text-blue-500"
                         >
                           {nft.owner}
                         </a>
                       </b>
                     </>
                    )
                    }

                    {/* {nft.owner.toLowerCase() !==
                    nftmarketplaceaddress.toLowerCase() ? (
                      <>
                        <p className="ml-2">Seller</p>
                        <b className="ml-2">
                          {nft.seller === ethers.constants.AddressZero ? (
                            "No seller"
                          ) : (
                            <a
                              target="_blank"
                              href={`/author/${nft.seller}`}
                              className="text-blue-500"
                            >
                              {nft.seller}
                            </a>
                          )}
                        </b>
                      </>
                    ) : (
                      <>
                        <p className="ml-2">Owner</p>
                        <a
                          target="_blank"
                          href={`/author/${nft.owner}`}
                          className="ml-2 text-blue-500"
                        >
                          {nft.owner}
                        </a>
                      </>
                    )} */}
                  </div>
                </div>
              </div>
              {auction !== null && tokenId && (
                <Timer
                  endTimeHex={auction ? auction.endTime._hex : 0}
                  tokenId={tokenId}
                />
              )}
              <div className="mt-4">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Current Bid</span>
                  <b className="text-2xl font-bold">
                    {nft.price} ETH{" "}
                    <span className="text-sm text-gray-400">
                      (≈ {convertToUSD(nft.price)} USD)
                    </span>
                  </b>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                {auction === null ? (
                  currentAccount &&
                  currentAccount === nft.seller.toLowerCase() ? (
                    <>
                      <button
                        disabled
                        className=" bg-[#545455] p-6 font-bold mt-8 rounded-xl"
                      >
                        You are the owner of this NFT
                      </button>
                      <Link
                        className="h-full"
                        href={`/assets/resell/${tokenId}`}
                      >
                        <button className="max-w-60 bg-purple-600 p-6 font-bold mt-8 rounded-xl">
                          List on Market
                        </button>
                      </Link>
                    </>
                  ) : nft.owner.toLowerCase() === currentAccount ? (
                    <MyButton
                      onClick={() => {
                        router.push(`/assets/resell/${tokenId}`);
                      }}
                      title="List on Market"
                    />
                  ) : (
                    <MyButton
                      disabled={
                        currentAccount === null ||
                        nft.seller === ethers.constants.AddressZero
                      }
                      onClick={handleBuyNFT}
                      title="Buy NFT"
                    />
                  )
                ) : // Nếu có đấu giá, hiển thị nút "Place Bid" hoặc "Your NFT currently on Auction"
                currentAccount &&
                  currentAccount === auction.seller.toLowerCase() ? (
                  <button
                    disabled
                    className="bg-[#545455] p-6 font-bold mt-8 rounded-xl"
                  >
                    Your NFT currently on Auction
                  </button>
                ) : (
                  <AuctionDialog
                    onClick={(price) => {
                      placeBid(nft.tokenId, price).then(() => {
                        // window.location.reload();
                      });
                    }}
                  />
                )}
                <MyButton
                  onClick={() => {
                    dispatch(
                      addToCart({
                        id: nft.tokenId,
                        price: nft.price,
                        name: nft.name,
                        image: nft.image,
                        owner: nft.owner,
                      })
                    );
                  }}
                  title="Add to cart"
                />
              </div>

              <div className="mt-6">
                <div className="flex space-x-4">
                  <Link
                    target="_blank"
                    href={`https://amoy.polygonscan.com/nft/${nftmarketplaceaddress}/${tokenId}`}
                  >
                    <button className="bg-[#ac8be0] text-white font-semibold  px-4 py-2 opacity-80 rounded-lg transition-opacity duration-300 hover:opacity-100">
                      Provenance
                    </button>
                  </Link>
                  <button className="bg-[#ac8be0] text-white  font-semibold px-4 py-2 opacity-80 rounded-lg transition-opacity duration-300 hover:opacity-100">
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
                      {auction && (
                        <div>
                          <span className="line-clamp-">
                            Offer by{" "}
                            <span className="font-semibold text-blue-300">
                              {auction.highestBidder ===
                              "0x0000000000000000000000000000000000000000" ? (
                                "No offers yet"
                              ) : (
                                <span
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      auction.highestBidder
                                    );
                                  }}
                                  className="flex items-center"
                                >
                                  {auction.highestBidder}
                                  <Copy
                                    size={16}
                                    className="ml-2 cursor-pointer"
                                  />
                                </span>
                              )}
                            </span>{" "}
                            <p className="font-semibold">
                              {priceInEth} ETH (≈ {convertToUSD(priceInEth)}{" "}
                              USD)
                            </p>
                            {/* {ethers.utils.parseEther(auction.highestBid).toString()} */}
                          </span>
                          <div className="text-sm text-gray-400">
                            June 14 - 4:12 PM
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Repeat the above block for more offers */}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            {history && <NFTTransactionChart transactionHistory={history} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTDetailsPage;
