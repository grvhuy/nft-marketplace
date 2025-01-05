"use client";

import React, { useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import AddressExplorer from "../address/page"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Search } from "lucide-react";
import {
  nftmarketplaceABI,
  nftmarketplaceaddress,
} from "../../../../../Context/constants";

// NFT Explorer Component
const NFTExplorer = ({ web3 }) => {
  const [tokenId, setTokenId] = useState("");
  const [nftData, setNftData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchNFTInfo = async () => {
    if (!tokenId || isNaN(tokenId)) {
      setError("Please enter a valid token ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const contract = new web3.eth.Contract(nftmarketplaceABI, nftmarketplaceaddress);
      const item = await contract.methods.fetchMarketItemById(tokenId).call();
      const tokenURI = await contract.methods.tokenURI(tokenId).call().catch(() => "");

      const [transferEvents, listingEvents] = await Promise.all([
        contract.getPastEvents("Transfer", { filter: { tokenId }, fromBlock: 0, toBlock: "latest" }),
        contract.getPastEvents("MarketItemCreated", { filter: { tokenId }, fromBlock: 0, toBlock: "latest" }),
      ]);

      const history = [
        ...transferEvents.map(event => ({
          type: "Transfer",
          from: event.returnValues.from,
          to: event.returnValues.to,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        })),
        ...listingEvents.map(event => ({
          type: "Listing",
          seller: event.returnValues.seller,
          price: web3.utils.fromWei(event.returnValues.price, "ether"),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        })),
      ]

      setNftData({
        tokenId: item.tokenId,
        owner: item.owner,
        seller: item.seller,
        price: web3.utils.fromWei(item.price, "ether"),
        sold: item.sold,
        tokenURI,
        history,
      });
    } catch (err) {
      console.error("Error fetching NFT data:", err);
      setError("Error fetching NFT data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            type="number"
            className="flex-1"
          />
          <Button onClick={searchNFTInfo} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {isLoading ? (
          <p className="text-center">Loading NFT information...</p>
        ) : (
          nftData && (
            <div>
              <h3 className="font-bold">NFT Details</h3>
              <p>Token ID: {nftData.tokenId}</p>
              <p>Owner: {nftData.owner}</p>
              <p>Seller: {nftData.seller}</p>
              <p>Price: {nftData.price} ETH</p>
              <p>Status: {nftData.sold ? "Sold" : "Listed"}</p>
              {nftData.tokenURI && <p>Token URI: {nftData.tokenURI}</p>}
              <h4>History:</h4>
              {nftData.history.map((event, idx) => (
                <div key={idx}>
                  <p>{event.type}</p>
                  {event.type === "Transfer" ? (
                    <>
                      <p>From: {event.from}</p>
                      <p>To: {event.to}</p>
                    </>
                  ) : (
                    <p>Seller: {event.seller}, Price: {event.price} ETH</p>
                  )}
                  <p>Tx Hash: {event.transactionHash}</p>
                </div>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

// Transaction Explorer Component
const TransactionExplorer = () => {
  const [txHash, setTxHash] = useState('');
  const [txData, setTxData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTransaction = async () => {
    if (!txHash || txHash.length !== 66) { // 0x + 64 hex chars
      setError('Please enter a valid transaction hash');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
      
      // Lấy thông tin transaction
      const tx = await provider.getTransaction(txHash);
      if (!tx) {
        throw new Error('Transaction not found');
      }

      // Lấy receipt để có thêm thông tin
      const receipt = await provider.getTransactionReceipt(txHash);
      
      // Lấy block để có timestamp
      const block = await provider.getBlock(tx.blockNumber);

      setTxData({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.utils.formatEther(tx.value),
        gasPrice: ethers.utils.formatUnits(tx.gasPrice, 'gwei'),
        gasLimit: tx.gasLimit.toString(),
        gasUsed: receipt.gasUsed.toString(),
        nonce: tx.nonce,
        blockNumber: tx.blockNumber,
        timestamp: block.timestamp,
        status: receipt.status === 1 ? 'Success' : 'Failed',
        logs: receipt.logs,
      });
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setError(error.message || 'Error fetching transaction data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter Transaction Hash (0x...)"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="flex-1"
          />
          <Button onClick={searchTransaction} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {isLoading && <div className="text-center">Loading transaction information...</div>}
        
        {txData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Status</p>
                <p className={`text-${txData.status === 'Success' ? 'green' : 'red'}-500`}>
                  {txData.status}
                </p>
              </div>
              <div>
                <p className="font-semibold">Timestamp</p>
                <p>{new Date(txData.timestamp * 1000).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Transaction Hash</p>
                <p className="font-mono text-sm break-all">{txData.hash}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">From</p>
                <p className="font-mono text-sm break-all">{txData.from}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">To</p>
                <p className="font-mono text-sm break-all">{txData.to}</p>
              </div>
              <div>
                <p className="font-semibold">Value</p>
                <p>{txData.value} ETH</p>
              </div>
              <div>
                <p className="font-semibold">Block</p>
                <p>{txData.blockNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Gas Price</p>
                <p>{txData.gasPrice} Gwei</p>
              </div>
              <div>
                <p className="font-semibold">Gas Used</p>
                <p>{txData.gasUsed}</p>
              </div>
            </div>

            {txData.logs.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">Event Logs</h3>
                <div className="space-y-2">
                  {txData.logs.map((log, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-mono text-sm">Address: {log.address}</p>
                      <p className="font-mono text-sm break-all">
                        Topics: {log.topics.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


// Main Blockchain Explorer Component
const BlockchainExplorer = () => {
  const web3 = new Web3("http://127.0.0.1:7545");

  return (
    <div className="p-4">
      <Tabs defaultValue="nft">
        <TabsList>
          <TabsTrigger value="nft">NFT Explorer</TabsTrigger>
          <TabsTrigger value="transaction">Transaction Explorer</TabsTrigger>
          <TabsTrigger value="address">Address Explorer</TabsTrigger>
        </TabsList>
        <TabsContent value="nft">
          <NFTExplorer web3={web3} />
        </TabsContent>
        <TabsContent value="transaction">
          <TransactionExplorer web3={web3} />
        </TabsContent>
        <TabsContent value="address">
          <AddressExplorer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainExplorer;
