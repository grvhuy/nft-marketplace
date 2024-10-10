"use client";

import axios from "axios";
import { ethers } from "ethers";
import React from "react";
import Web3modal from "web3modal";
import { nftmarketplaceABI, nftmarketplaceaddress } from "./constants";

const fetchContract = (providerOrSigner) =>
  new ethers.Contract(
    nftmarketplaceaddress,
    nftmarketplaceABI,
    providerOrSigner
  );

const connectWithContract = async () => {
  try {
    const web3Modal = new Web3modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("loi ket noi contract :", error);
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover NFTs world";
  const [currentAccount, setCurrentAccount] = React.useState("");

  // check wallet connection
  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please connect or install your Metamask wallet");
        return;
      }
      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]); // Set the account in state
        console.log("Connected account:", accounts[0]); // Log the account directly
      } else {
        console.log("No authorized account found");
      }
      return accounts[0];
    } catch (error) {
      console.log("Error checking contract:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please connect or install your Metamask wallet");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.log("Error connecting wallet:", error);
    }
  };

  const uploadFile = async (file) => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }
      const data = new FormData();
      data.set("file", file);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const ipfsUrl = await uploadRequest.json();
      if (ipfsUrl) {
        console.log("File uploaded to IPFS:", ipfsUrl);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      alert(error);
    }
  };

  const createNFT = async (name, description, price, image, router) => {
    if (!name || !price || !image || !description) {
      alert("Please fill all fields");
      return;
    }
    const data = JSON.stringify({
      name,
      description,
      image,
    });

    try {
      const response = await axios(
        {
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: data,
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: `f5ae3b8c67acdfa150eb`,
            pinata_secret_api_key: `ecae8e87af7c08c83d9627c39cab071a941bb98d271d8afbcc582f6192c1843a`,
          },
        }
      );
      
      const ipfsUrl = `https://blue-wonderful-antelope-164.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("IPFS URL:", ipfsUrl);
      await createSale(ipfsUrl, price);


    } catch (error) {
      console.error("Error during NFT creation:", error.message);
      alert(error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice.toString(), "ether");
      const contract = await connectWithContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(url, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
    } catch (error) {
      console.error("Error during NFT sale creation:", error);
    }
  };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems();

      console.log("NFTs fetched:", data);
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { name, description, image },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              price,
              name,
              description,
              image,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.error("Error during NFT fetching:", error);
    }
  };

  const fetchMineOrListedNFTs = async (type) => {
    try {
      const contract = await connectWithContract();
      const data =
        type === "listed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFT();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { name, description, image },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              price,
              name,
              description,
              image,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.error("Error during NFT fetching:", error);
    }
  };

  const buyNFT = async (nft) => {
    try {
      const contract = await connectWithContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
    } catch (error) {
      console.error("Error during NFT purchase:", error);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        titleData,
        checkWalletConnection,
        uploadFile,
        createNFT,
        fetchNFTs,
        fetchMineOrListedNFTs,
        buyNFT,
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
export default NFTMarketplaceContext;
