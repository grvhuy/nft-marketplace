"use client";

import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../Context/NFTMarketplaceContext";
import CollectionContainer from "../components/home-page/CollectionContainer";
import HeroSection from "../components/home-page/HeroSection";
import MoreNFTContainer from "../components/home-page/MoreNFTContainer";
import IntroContainer from "../components/home-page/IntroContainer";
// env

export default function Home() {
  const [count, setCount] = useState(0);

  const { createNFT, fetchNFTs, currentAccount, showCurrentAccount } =
    useContext(NFTMarketplaceContext);
  useEffect(() => {
    // console.log("API Key:", process.env.NEXT_PUBLIC_PINATA_API_KEY);
  });

  return (
    <div className="bg-[#2b2b2b] flex flex-col  justify-center min-h-screen">
      <HeroSection />
      <CollectionContainer />
      <MoreNFTContainer />
      <IntroContainer />
    </div>
  );
}
