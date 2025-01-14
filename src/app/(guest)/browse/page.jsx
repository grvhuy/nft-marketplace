"use client";
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
        console.log(items);
        setAuctionedNfts(items);
      });
    }
  }, [auctionsIds]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const filteredData =
    activeFilter === "All"
      ? [...filteredNfts, ...auctionedNfts]
      : activeFilter === "Listed NFTs"
      ? nfts
      : auctionedNfts;

  const paginatedData = getPaginatedData(filteredData);
  const totalPages = getTotalPages(filteredData);

  return (
    <div className="mx-20 min-h-screen bg-[#2e2e2e]">
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

      <div className="flex flex-wrap mx-8">
        {paginatedData &&
          paginatedData.map((nft, index) => {
            if (activeFilter === "On Auction") {
              return (
                <SearchCard
                  key={`${nft.tokenURI}-${index}`}
                  tokenId={nft.tokenId}
                  image={nft.image}
                  name={nft.name}
                  price={nft.price}
                />
              );
            }
            return (
              <SearchCard
                key={`${nft.tokenURI}-${index}`}
                tokenId={nft.tokenId}
                image={nft.image}
                name={nft.name}
                price={nft.price}
              />
            );
          })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-16  pb-4 text-white">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded-md mx-2 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded-md mx-2 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
