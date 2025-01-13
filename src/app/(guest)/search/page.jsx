"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchFilter from "../../../components/SearchFilters";
import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import SearchCard from "../../../components/SearchCard";

const SearchPage = () => {
  const { fetchNFTs, currentAccount, fetchAllAuctions, fetchNFTsByIds } =
    useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [auctionsIds, setAuctionsIds] = useState([]);
  const [auctionedNfts, setAuctionedNfts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Most Recent");

  useEffect(() => {
    fetchNFTs().then((item) => {
      if (!item) return;
      setNfts(item.reverse());
      setFilteredNfts(item);
      console.log(item);
      console.log(currentAccount);
    });
  }, []);

  useEffect(() => {
    fetchAllAuctions().then((items) => {
      if (!items) return;
      items.map((item) => {
        if (!auctionsIds.includes(item.tokenId.toNumber())) {
          setAuctionsIds((prev) => [...prev, item.tokenId.toNumber()]);
        }
      });
    });
  }, [nfts]);

  useEffect(() => {
    if (auctionsIds.length > 0) {
      fetchNFTsByIds(auctionsIds).then((items) => {
        // if (!items) return;
        // setNfts(items);
        // setFilteredNfts(items);
        console.log(items);
        setAuctionedNfts(items);
      });
    }
  }, [auctionsIds]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="mx-20 min-h-screen bg-[#2e2e2e]">
      {/* <div className="mx-24 mt-8 flex justify-center items-center space-x-2">
        <Input
          placeholder="Search for NFTs, Collections, and more..."
          className="mt-8 text-lg w-1/2 text-white shadow-md p-4 py-6 rounded-lg"
        />
        <Search className="w-8 h-8 text-white mt-8 cursor-pointer" />
      </div> */}
      <div className="mt-8 mx-8 flex items-center justify-between p-4 space-x-4">
        <div className="flex space-x-2">
          {["All", "Listed NFTs", "On Auction"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-full shadow-sm transition duration-500 ${
                activeFilter === filter
                  ? "bg-[#a259ff] text-white font-semibold"
                  : "bg-white"
              } `}
            >
              {filter}
            </button>
          ))}
        </div>
        <div>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm"
          >
            <option>Most Recent</option>
            <option>Oldest</option>
            <option>Most Popular</option>
          </select>
        </div>
      </div>

      {activeFilter === "All" && (
        <div className="flex flex-wrap mx-8">
          {filteredNfts &&
            filteredNfts.map((nft) => (
              <SearchCard
                key={nft.tokenURI}
                tokenId={nft.tokenId}
                image={nft.image}
                name={nft.name}
                price={nft.price}
              />
            ))}

          {auctionedNfts &&
            auctionedNfts.map((nft, index) => {
              if (index % 2 === 0) {
                return (
                  <SearchCard
                    key={nft.tokenURI + "-auction" + index}
                    tokenId={nft.tokenId}
                    image={nft.image}
                    name={nft.name}
                    price={nft.price}
                  />
                );
              }
              return;
            })}
        </div>
      )}

      {activeFilter === "Listed NFTs" && (
        <div className="flex flex-wrap mx-8">
          {nfts &&
            nfts.map((nft) => (
              <SearchCard
                key={nft.tokenURI}
                tokenId={nft.tokenId}
                image={nft.image}
                name={nft.name}
                price={nft.price}
              />
            ))}
        </div>
      )}

      {activeFilter === "On Auction" && (
        <div className="flex flex-wrap mx-8">
          {auctionedNfts &&
            auctionedNfts.map((nft, index) => {
              if (index % 2 === 0) {
                return (
                  <SearchCard
                    key={nft.tokenURI + "-auction" + index}
                    tokenId={nft.tokenId}
                    image={nft.image}
                    name={nft.name}
                    price={nft.price}
                  />
                );
              }
              return;
            })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
