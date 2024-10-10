"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import NFTMarketplaceContext from "../../Context/NFTMarketplaceContext";

export default function Home() {
  const [count, setCount] = useState(0);

  const { createNFT, fetchNFTs } = useContext(NFTMarketplaceContext);
  useEffect(() => {

  }, []); // Chạy mỗi khi helloWorld thay đổi

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Hello</h1>
      <button
        onClick={() => {
          createNFT(
            "NFT NAME",
            "NFT DESCRIPTION",
            0.1,
            "https://blue-wonderful-antelope-164.mypinata.cloud/ipfs/bafkreicjk7vnvndjfdy4bbkqlphzi4juyxxswbszu77ak2pv2edwlgcnby"
          )
        }}
      >
        create NFT
      </button>
      <button onClick={() => {
        fetchNFTs().then((res) => {
          console.log(res);
        }
        );
      }}>
        fetchNFTs
      </button>
    </div>
  );
}
