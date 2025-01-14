"use client";

import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import Web3modal from "web3modal";
import { nftmarketplaceABI, nftmarketplaceaddress } from "./constants";
import { useRouter } from "next/navigation";
import { convertToUSD } from "../utils/convert";
// import { addUser } from "@/lib/rxDB";

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
  const rpcJSONProviderString = "http://127.0.0.1:7545";
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

  async function handleAccountsChanged(accounts) {
    // Nếu không có tài khoản nào, hãy thực hiện các hành động cần thiết khi người dùng đăng xuất
    if (accounts.length === 0) {
      disconnectWallet();
      alert("You've disconnected your wallet.");
    } else {
      // Có tài khoản mới, cập nhật tài khoản hiện tại
      const newAccount = accounts[0];
      setCurrentAccount(newAccount);

      localStorage.setItem("currentAccount", newAccount);
      document.cookie = `walletConnected=true; path=/; SameSite=Strict`;

      console.log("Connected account:", newAccount);
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
        return null;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];

        // const ipfsHash = await getUserIPFSHash(account);

        // if (!ipfsHash) {
        //   alert("No IPFS hash found for this account. Please create one.");
        // }

        // if (!ipfsHash) {
        //   const defaulUserData = {
        //     address: account,
        //     name: "Anonymous",
        //     bio: "No bio",
        //     email: "Not provided yet",
        //     avatar: "",
        //     socials: {
        //       facebook: "",
        //       twitter: "",
        //       instagram: "",
        //     },
        //   };

        //   const dataToPIN = {
        //     pinataMetadata: {
        //       name: `${account}.json`,
        //     },
        //     pinataContent: defaulUserData,
        //   };

        //   const newhash = await fetch(
        //     "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        //     {
        //       method: "POST",

        //       headers: {
        //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(dataToPIN),
        //     }
        //   );

        //   if (newhash.status === 200) {
        //     const response = await newhash.json();
        //     await setUserIPFSHash(response.IpfsHash);
        //     alert("IPFS Hash has been created and set successfully!");
        //   } else {
        //     alert("Failed to create IPFS Hash.");
        //   }
        // }

        // Lưu vào localStorage để duy trì giữa các lần reload
        localStorage.setItem("currentAccount", account);

        document.cookie = `walletConnected=true; path=/; SameSite=Strict`;

        // await addUser(account);

        setCurrentAccount(account);

        console.log("Connected account:", account);
        return account;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
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
          pinata_api_key: "87b515e0af1c6568fc71",
          pinata_secret_api_key:
            "125429af9899ca059f171c7007afdefacc2c6f8da5ee8218979028dcec192e48",
        },
      });

      const ipfsUrl = `https://jade-legislative-fowl-319.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
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
      // Validate price input
      if (!formInputPrice || isNaN(formInputPrice) || formInputPrice <= 0) {
        alert("Please enter a valid price.");
        return;
      }

      // Convert price to wei
      const price = ethers.utils.parseUnits(formInputPrice.toString(), "ether");
      const contract = await connectWithContract();

      // Get listing price
      const listingPrice = await contract.getListingPrice();

      // Prepare signer and network details
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const network = await provider.getNetwork();

      // Log debug information
      console.log("Create Sale Debug:", {
        url,
        price: price.toString(),
        listingPrice: listingPrice.toString(),
        signerAddress,
        network: network.name,
        isReselling,
      });

      // Estimate gas
      let gasEstimate;
      let transaction;

      if (!isReselling) {
        console.log("Creating new NFT...");
        gasEstimate = await contract.estimateGas.createToken(url, price, {
          value: listingPrice,
        });

        transaction = await contract.createToken(url, price, {
          value: listingPrice,
          gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
          type: 2, // EIP-1559 transaction type
          maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
          maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
        });
      } else {
        console.log("Reselling existing NFT...");
        gasEstimate = await contract.estimateGas.resellToken(url, price, {
          value: listingPrice,
        });

        transaction = await contract.resellToken(url, price, {
          value: listingPrice,
          gasLimit: gasEstimate.mul(120).div(100),
          type: 2,
          maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
          maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
        });
      }

      // Wait for transaction confirmation
      const receipt = await transaction.wait(1);

      // Check transaction status
      if (receipt.status === 1) {
        // Success handling
        const successMessage = isReselling
          ? "NFT resold successfully!"
          : "NFT created successfully!";

        // alert(successMessage);

        // Navigate based on creation or reselling
        if (!isReselling) {
          router.push("/browse");
        } else {
          router.refresh();
        }

        return {
          success: true,
          transactionHash: receipt.transactionHash,
        };
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      // Comprehensive error logging
      console.error("NFT Sale Error:", {
        code: error.code,
        message: error.message,
        reason: error.reason,
        stack: error.stack,
      });

      // Specific error handling
      if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
        alert("Insufficient funds. Please add funds to your wallet.");
      } else if (error.code === ethers.errors.ACTION_REJECTED) {
        alert("Transaction was rejected by user.");
      } else if (error.message.includes("insufficient funds")) {
        alert("Insufficient balance for gas fees.");
      } else if (error.message.includes("nonce")) {
        alert("Transaction nonce issue. Try resetting your MetaMask account.");
      } else {
        alert(`Transaction failed: ${error.message}`);
      }

      return {
        success: false,
        error: error.message,
      };
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
            try {
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
            } catch (ipfsError) {
              console.error("Error fetching token URI data:", ipfsError);
              return {
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                price: ethers.utils.formatUnits(
                  unformattedPrice.toString(),
                  "ether"
                ),
                name: "Error",
                description: "Error fetching metadata",
                image: "",
                tokenURI,
              };
            }
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
      const web3Modal = new Web3modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketplaceaddress,
        nftmarketplaceABI,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        alert("NFT purchased successfully!");
        router.refresh();
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

  const fetchNFTsByOwner = async (owner) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        rpcJSONProviderString
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchNFTsByOwner(owner);

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

  const fetchAllAuctions = async () => {
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

  const setUserIPFSHash = async (userAddress, ipfsHash) => {
    try {
      const contract = await connectWithContract();
      const transaction = await contract.setUserIPFSHash(userAddress, ipfsHash);
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        // alert("IPFS Hash updated successfully!");
      } else {
        alert("Failed to update IPFS hash.");
      }
    } catch (error) {
      console.error("Error updating user IPFS hash:", error);
      alert("Error updating IPFS hash.");
    }
  };

  const getUserIPFSHash = async (userAddress) => {
    try {
      const contract = await connectWithContract();
      const ipfsHash = await contract.getUserIPFSHash(userAddress);
      return ipfsHash;
    } catch (error) {
      console.error("Error fetching user IPFS hash:", error);
      return null;
    }
  };

  const changeNFTListingPrice = async (newPrice) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      // Convert newPrice to wei
      const price = ethers.utils.parseUnits(newPrice.toString(), "ether");

      // Pass the converted price to the contract function
      const transaction = await contract.updateListingPrice(price);

      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        alert("Listing price changed successfully!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during listing price change:", error);
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
        fetchAllAuctions,
        setUserIPFSHash,
        getUserIPFSHash,
        fetchNFTsByOwner,
        changeNFTListingPrice,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
export default NFTMarketplaceContext;
