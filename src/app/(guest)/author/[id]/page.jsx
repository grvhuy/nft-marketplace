"use client";
import { useContext, useEffect, useState } from "react";
import AuthorCard from "../../../../components/AuthorCard";
import AuthorCollection from "../../../../components/AuthorCollection";
import AuthorFilters from "../../../../components/AuthorFilters";
import NFTMarketplaceContext from "../../../../../Context/NFTMarketplaceContext";
import { usePathname } from "next/navigation";

const CollectionPage = () => {
  const id = usePathname().split("/").pop();

  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);

  const { fetchMineOrListedNFTs, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  useEffect(() => {
    console.log("id:", currentAccount);
    fetchMineOrListedNFTs("listed").then((res) => {
      setNfts(res);
      console.log("listed nfts:", res);

    });
  }, []);

  useEffect(() => {
    fetchMineOrListedNFTs("mine").then((res) => {
      setMyNfts(res);
      console.log(res);
    });
  }, []);

  return (
    <div className="mx-20 min-h-screen">
      <AuthorCard />
      <AuthorFilters />

      {currentAccount && currentAccount === id ? (
        <AuthorCollection nfts={myNfts} />
      ) : (
        <AuthorCollection nfts={nfts} />
      )}
    </div>
  );
};

export default CollectionPage;
