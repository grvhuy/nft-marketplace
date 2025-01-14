"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import { contractOwner } from "../../../../Context/constants";
import { BanIcon, Search } from "lucide-react";
import { ethers } from "ethers";

const Restrict = () => {
  const [searchAddress, setSearchAddress] = useState("");
  const [addressData, setAddressData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentAccount, setUserIPFSHash, getUserIPFSHash } = useContext(
    NFTMarketplaceContext
  );

  const fetchUserData = async () => {
    if (!ethers.utils.isAddress(searchAddress)) {
      setError("Invalid Ethereum address");
      return;
    }

    setIsLoading(true);
    setError("");

    const hash = await getUserIPFSHash(searchAddress);
    if (!hash) {
      setError("User has not updated their profile yet.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("hash", hash);
      const link = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${hash}`;
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAddressData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data");
    }
  };

  const restrictUser = async () => {
    // alert("Are you sure you want to restrict this user?");
    // prompt("Are you sure you want to restrict this user?");
    const data = {
      ...addressData,
      restricted: true,
    };

    try {
      const dataToPIN = {
        pinataMetadata: {
          name: `${searchAddress}.json`,
          timestamp: new Date().toISOString(),
        },
        pinataContent: data,
      };

      const newhash = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToPIN),
        }
      );

      if (newhash.status === 200) {
        const response = await newhash.json();
        console.log("response", response);
        await setUserIPFSHash(searchAddress, response.IpfsHash);
      }
    } catch {
      console.error("Error restricting user:", error);
      alert("Failed to restrict user. Check console for details.");
    }

    // setAddressData(null);
    // setSearchAddress("");
  };

  const unrestrictUser = async () => {
    // alert("Are you sure you want to restrict this user?");
    // prompt("Are you sure you want to restrict this user?");
    const data = {
      ...addressData,
      restricted: false,
    };

    try {
      const dataToPIN = {
        pinataMetadata: {
          name: `${searchAddress}.json`,
          timestamp: new Date().toISOString(),
        },
        pinataContent: data,
      };

      const newhash = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToPIN),
        }
      );

      if (newhash.status === 200) {
        const response = await newhash.json();
        console.log("response", response);
        await setUserIPFSHash(searchAddress, response.IpfsHash);
      }
    } catch {
      console.error("Error restricting user:", error);
      alert("Failed to restrict user. Check console for details.");
    }

    // setAddressData(null);
    // setSearchAddress("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Restrict an user (No longer update profile, mint and sell NFTs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Ethereum address (0x...)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchUserData}>
              <BanIcon className="w-4 h-4 mr-2" />
              BAND
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {addressData && (
            <div className="mt-4">
              <p className="font-bold">User Profile:</p>
              {/* <pre>{JSON.stringify(addressData, null, 2)}</pre> */}
              <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  className="w-full h-48 object-cover"
                  src={addressData.profileImage}
                  alt="Profile"
                />
                {addressData.restricted && (
                  <div className="bg-red-500 text-white text-center p-2 flex items-center">
                    <BanIcon className="w-4 h-4 mr-2" />
                    Restricted
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {addressData.name}
                  </h2>
                  <p className="text-gray-600">{addressData.email}</p>
                  <p className="mt-4 text-gray-700">{addressData.bio}</p>
                  <div className="flex mt-4 space-x-3">
                    <a
                      href={addressData.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Facebook
                    </a>
                    <a
                      href={addressData.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-700"
                    >
                      Instagram
                    </a>
                    <a
                      href={addressData.twitterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      Twitter
                    </a>
                  </div>

                  {/* ban if not restricted */}
                  {!addressData.restricted && (
                    <Button onClick={restrictUser} className="mt-4">
                      Restrict User
                    </Button>
                  )}
                  {/* unban if restriced */}
                  {addressData.restricted && (
                    <Button onClick={unrestrictUser} className="mt-4">
                      Unrestrict User
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center text-white">
          Loading address information...
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const { currentAccount, changeNFTListingPrice } = useContext(
    NFTMarketplaceContext
  );
  const [userData, setUserData] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  if (currentAccount.toLowerCase() !== contractOwner.toLowerCase()) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center text-white">
        Unauthorized
      </div>
    );
  }

  const handleChangePrice = async () => {
    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }
    try {
      await changeNFTListingPrice(parseFloat(newPrice));
    } catch (error) {
      console.error("Error changing listing price:", error);
      alert("Failed to change listing price. Check console for details.");
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <Tabs defaultValue="listingPrice">
        <TabsList>
          <TabsTrigger value="listingPrice">Listing Price</TabsTrigger>
          <TabsTrigger value="restrict">Restriction</TabsTrigger>
        </TabsList>
        <TabsContent value="restrict">
          <Restrict />
        </TabsContent>
        <TabsContent value="listingPrice">
          <div className="bg-white rounded-md p-4">
            <CardTitle >Change listing price</CardTitle>
            <div className="flex items-center space-x-2 mt-4">
              <Input
                type="number"
                placeholder="Enter new listing price (ETH)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <Button onClick={handleChangePrice}>Change Price</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
