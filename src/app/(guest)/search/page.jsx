"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchFilter from "../../../components/SearchFilters";
import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import SearchCard from "../../../components/SearchCard";

const SearchPage = () => {
  const { fetchNFTs, currentAccount } = useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);

  useEffect(() => {
    fetchNFTs().then((item) => {
      if (!item) return;
      setNfts(item.reverse());
      setFilteredNfts(item);
      console.log(item);
      console.log(currentAccount);
    });
  }, []);

  return (
    <div className="mx-20 min-h-screen bg-[#2e2e2e]">
      <div className="mx-24 mt-8 flex justify-center items-center space-x-2">
        <Input
          placeholder="Search for NFTs, Collections, and more..."
          className="mt-8 text-lg w-1/2 text-white shadow-md p-4 py-6 rounded-lg"
        />
        <Search className="w-8 h-8 text-white mt-8 cursor-pointer" />
      </div>
      <SearchFilter />

      <div className="flex flex-wrap mx-8">
        {nfts && nfts.map((nft) => (
          <SearchCard
            key={nft.tokenURI}
            tokenId={nft.tokenId}
            image={nft.image}
            name={nft.name}
            price={nft.price}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
