import Web3 from "web3";
// import { ethers } from "ethers";
import { nftmarketplaceABI, nftmarketplaceaddress } from "../Context/constants";

export const searchNFTInfo = async (tokenId) => {
  const web3 = new Web3("http://127.0.0.1:7545");

  if (!tokenId || isNaN(tokenId)) {
    setError("Please enter a valid token ID");
    return;
  }

  try {
    const contract = new web3.eth.Contract(
      nftmarketplaceABI,
      nftmarketplaceaddress
    );
    const item = await contract.methods.fetchMarketItemById(tokenId).call();
    const tokenURI = await contract.methods
      .tokenURI(tokenId)
      .call()
      .catch(() => "");

    const [transferEvents, listingEvents] = await Promise.all([
      contract.getPastEvents("Transfer", {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: "latest",
      }),
      contract.getPastEvents("MarketItemCreated", {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: "latest",
      }),
    ]);

    const addTransactionDetails = async (events) => {
      return Promise.all(
        events.map(async (event) => {
          const block = await web3.eth.getBlock(event.blockNumber);
          const transaction = await web3.eth.getTransaction(
            event.transactionHash
          );

          return {
            ...event,
            timestamp: new Date(
              Number(block.timestamp) * 1000
            ).toLocaleString(),
            value: web3.utils.fromWei(transaction.value, "ether"),
          };
        })
      );
    };

    const transferHistory = await addTransactionDetails(transferEvents);
    const listingHistory = await addTransactionDetails(listingEvents);

    const history = [
      ...transferHistory.map((event) => ({
        type: "Transfer",
        from: event.returnValues.from,
        to: event.returnValues.to,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        timestamp: event.timestamp,
        value: event.value,
      })),
      ...listingHistory.map((event) => ({
        type: "Listing",
        seller: event.returnValues.seller,
        price: web3.utils.fromWei(event.returnValues.price, "ether"),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        timestamp: event.timestamp,
      })),
    ];

    return {
      tokenId: item.tokenId,
      owner: item.owner,
      seller: item.seller,
      price: web3.utils.fromWei(item.price, "ether"),
      sold: item.sold,
      tokenURI,
      history,
    };
  } catch (err) {
    console.error("Error fetching NFT data:", err);
  }
};
