"use client";

import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import Web3modal from "web3modal";
import { nftmarketplaceABI, nftmarketplaceaddress } from "./constants";
import { useRouter } from "next/navigation";
import { convertToUSD } from "../utils/convert";

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
  const rpcJSONProviderString = "https://rpc-amoy.polygon.technology/";
  const localRPCProviderString = "http://localhost:8545";
  const router = useRouter();
  const titleData = "Discover NFTs world";
  const [currentAccount, setCurrentAccount] = React.useState("");

  useEffect(() => {
    // fetchNFTs();
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnected", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnected", handleDisconnect);
      }
    };
  }, []);

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setCurrentAccount(accounts[0]);
    }
  }

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
    document.cookie =
      "walletConnected=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please connect or install your Metamask wallet");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        document.cookie = `walletConnected=true; path=/;`;
      } else {
        console.log("No authorized account found");
      }
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
      document.cookie = `walletConnected=true; path=/;`;
      // window.location.reload();
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

      return ipfsUrl;
      // if (ipfsUrl) {
      //   console.log("File uploaded to IPFS:", ipfsUrl);
      // }
    } catch (error) {
      console.error("Error during file upload:", error);
      alert(error);
    }
  };

  const createNFT = async (name, description, price, image) => {
    console.log("Creating NFT with data:");
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
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: "f5ae3b8c67acdfa150eb",
          // process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key:
            "ecae8e87af7c08c83d9627c39cab071a941bb98d271d8afbcc582f6192c1843a",
          // process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
        },
      });

      const ipfsUrl = `https://blue-wonderful-antelope-164.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
      await createSale(ipfsUrl, price);

      // if (response.data.IpfsHash) {
      //   router.push("/");
      // }
    } catch (error) {
      console.error("Error during NFT creation:", error.message);
      alert(error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      // Kiểm tra giá
      if (!formInputPrice || isNaN(formInputPrice) || formInputPrice <= 0) {
        alert("Please enter a valid price.");
        return;
      }

      const price = ethers.utils.parseUnits(formInputPrice.toString(), "ether");
      const contract = await connectWithContract();

      // Lấy listing price từ hợp đồng
      const listingPrice = await contract.getListingPrice();

      // Lấy nonce hiện tại
      const signer = provider.getSigner();
      const nonce = await provider.getTransactionCount(
        await signer.getAddress(),
        "latest"
      );

      let transaction;
      if (!isReselling) {
        console.log("Creating new NFT...");
        transaction = await contract.createToken(url, price, {
          value: listingPrice.toString(),
          nonce: nonce,
        });

        router.push("/search");
      } else {
        console.log("Reselling existing NFT...");
        transaction = await contract.resellToken(url, price, {
          value: listingPrice.toString(),
        });
      }

      const receipt = await transaction.wait();
      console.log("NFT created successfully: ", receipt);

      if (receipt.status === 1) {
        alert("NFT created successfully!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during NFT sale creation:", error.message);

      // Xử lý lỗi cụ thể
      if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
        alert(
          "Insufficient funds for the transaction. Please fund your account."
        );
      } else if (error.code === ethers.errors.NONCE_EXPIRED) {
        alert("Transaction nonce expired. Please try again.");
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        rpcJSONProviderString
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems();

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
          : await contract.fetchMyNFTs();

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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        alert("NFT purchased successfully!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during NFT purchase:", error);
    }
  };

  const fetchNFTsByIds = async (ids) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        rpcJSONProviderString
      );
      const contract = fetchContract(provider); // Ensure fetchContract returns the updated contract instance
      const data = await contract.fetchMarketItemsByIds(ids);

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

  const fetchNFTById = async (id) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        rpcJSONProviderString
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItemById(id);

      const tokenURI = await contract.tokenURI(data.tokenId);

      const {
        data: { name, description, image },
      } = await axios.get(tokenURI);

      const item = {
        tokenId: data.tokenId.toNumber(),
        seller: data.seller,
        owner: data.owner,
        price: ethers.utils.formatUnits(data.price.toString(), "ether"),
        name: name,
        description: description,
        image: image,
        tokenURI: tokenURI,
        data: data,
      };

      return item;
    } catch (error) {
      console.error("Error during NFT fetching:", error);
    }
  };

  const startAuction = async (tokenId, startPrice, duration) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      // chuyen startPrice va duration tu string sang number
      startPrice = ethers.utils.parseUnits(startPrice.toString(), "ether");
      duration = parseInt(duration);

      const transaction = await contract.startAuction(
        tokenId,
        startPrice,
        duration
      );

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        alert("Auction started successfully!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during auction start:", error);
    }
  };

  const placeBid = async (tokenId, bidAmount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.placeBid(tokenId, {
        value: ethers.utils.parseEther(bidAmount.toString()),
      });

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        alert("Bid placed successfully!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (e) {
      alert(e.message || "Error during bid placing");
    }
  };

  const endAuction = async (tokenId) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.endAuction(tokenId);

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        alert("Auction ended successfully!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during auction end:", error);
    }
  };

  const fetchAuction = async (tokenId) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        rpcJSONProviderString
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchAuction(tokenId);

      if (data === null) {
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error during auction fetching:", error);
    }
  };

  const fetchAllAuction = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        rpcJSONProviderString
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchActiveAuctions();

      return data;
    } catch (error) {
      console.error("Error during auction fetching:", error);
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
        fetchNFTsByIds,
        fetchNFTById,
        createSale,
        startAuction,
        placeBid,
        endAuction,
        fetchAuction,
        fetchAllAuction,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
export default NFTMarketplaceContext;
