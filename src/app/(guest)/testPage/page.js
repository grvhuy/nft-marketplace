"use client";

import { useContext, useState } from "react";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";

export default function Home() {
  const { uploadFile } = useContext(NFTMarketplaceContext);
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  return (
		<main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
			<input type="file" onChange={handleChange} />
			<button disabled={uploading} onClick={() => uploadFile(file)}>
				{uploading ? "Uploading..." : "Upload"}
			</button>
			{/* Add a conditional looking for the signed url and use it as the source */}
			{url && <img src={url} alt="Image from Pinata" />}
		</main>
  );
}
