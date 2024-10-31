"use client";

import { useContext, useState } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";

export default function Home() {
  const { fetchNFTsByIds, fetchNFTs } = useContext(NFTMarketplaceContext);
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  const ids = [1, 2];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Hello</h1>
      <button
        onClick={() => {
          fetchNFTsByIds(ids).then((res) => {
            console.log(res);
          });
        }}
      >
        fetch nft by ids
      </button>
    </div>
  );
}
