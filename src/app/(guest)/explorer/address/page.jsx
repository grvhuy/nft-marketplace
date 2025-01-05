"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Search } from "lucide-react";
import {
  nftmarketplaceABI,
  nftmarketplaceaddress,
} from "../../../../../Context/constants";

const AddressExplorer = () => {
  const [searchAddress, setSearchAddress] = useState("");
  const [addressData, setAddressData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchAddressInfo = async () => {
    if (!ethers.utils.isAddress(searchAddress)) {
      setError("Invalid Ethereum address");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "HTTP://127.0.0.1:7545"
      );
      const marketplace = new ethers.Contract(
        nftmarketplaceaddress,
        nftmarketplaceABI,
        provider
      );

      // Lấy số dư ETH
      const balance = await provider.getBalance(searchAddress);

      // Lấy lịch sử giao dịch (10 giao dịch gần nhất)
      const latestBlock = await provider.getBlockNumber();
      const lastTenBlocks = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          provider.getBlockWithTransactions(latestBlock - i)
        )
      );

      const transactions = lastTenBlocks
        .flatMap((block) => block.transactions)
        .filter(
          (tx) =>
            tx.from.toLowerCase() === searchAddress.toLowerCase() ||
            tx.to?.toLowerCase() === searchAddress.toLowerCase()
        )
        .slice(0, 10);

      // Lấy NFTs của địa chỉ
      const filter = marketplace.filters.MarketItemCreated();
      const events = await marketplace.queryFilter(filter);
      const nfts = await marketplace.fetchNFTsByOwner(searchAddress);
      

      setAddressData({
        address: searchAddress,
        balance: ethers.utils.formatEther(balance),
        transactions,
        // nfts,
      });
    } catch (error) {
      console.error("Error fetching address data:", error);
      setError("Error fetching address data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Address Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Ethereum address (0x...)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchAddressInfo} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center">Loading address information...</div>
      )}

      {addressData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Balance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm break-all">
                Address: {addressData.address}
              </p>
              <p className="mt-2">Balance: {addressData.balance} ETH</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>NFTs ({addressData.nfts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addressData.nfts.map((nft) => (
                  <div key={nft.tokenId} className="border-b pb-4">
                    <p className="font-bold">Token ID: {nft.tokenId}</p>
                    <p className="text-sm">
                      Role:{" "}
                      {nft.seller.toLowerCase() === searchAddress.toLowerCase()
                        ? "Seller"
                        : "Owner"}
                    </p>
                    <p className="text-sm">Price: {nft.price} ETH</p>
                    <p className="text-sm">
                      Status: {nft.sold ? "Sold" : "Listed"}
                    </p>
                    {nft.tokenURI && (
                      <p className="text-sm break-all">
                        Token URI: {nft.tokenURI}
                      </p>
                    )}
                  </div>
                ))}
                {addressData.nfts.length === 0 && (
                  <p>No NFTs found for this address</p>
                )}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addressData.transactions.map((tx) => (
                  <div key={tx.hash} className="border-b pb-4">
                    <p className="font-mono text-sm break-all">
                      Hash: {tx.hash}
                    </p>
                    <p className="text-sm">
                      Type:{" "}
                      {tx.from.toLowerCase() === searchAddress.toLowerCase()
                        ? "Sent"
                        : "Received"}
                    </p>
                    <p className="text-sm">
                      {tx.from.toLowerCase() === searchAddress.toLowerCase()
                        ? "To: "
                        : "From: "}
                      {tx.from.toLowerCase() === searchAddress.toLowerCase()
                        ? tx.to
                        : tx.from}
                    </p>
                    <p className="text-sm">
                      Value: {ethers.utils.formatEther(tx.value)} ETH
                    </p>
                  </div>
                ))}
                {addressData.transactions.length === 0 && (
                  <p>No recent transactions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AddressExplorer;

