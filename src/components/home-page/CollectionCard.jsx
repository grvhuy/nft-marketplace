"use client";

import Image from "next/image";
import { shortenAddress } from "../../../utils/convert";
import { useRouter } from "next/navigation";

const CollectionCard = (props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/my-collections/edit/${props.name}`)}
      className="transition-transform transform hover:scale-95 duration-300"
    >
      <div className="min-w-1/3 mr-4 shadow-md bg-[#3b3b3b] opacity-90 hover:opacity-100 my-4 rounded-2xl">
        <Image
          src={props.image}
          alt="Example Image"
          // chinh w = 100 vw
          sizes="100vw"
          width={400}
          height={400}
          className="aspect-[5/3] object-cover rounded-t-2xl"
        />
        <div className="bg-[#3b3b3b] px-4 py-2 text-lg rounded-2xl">
          <h3 className="text-white font-bold">{props.name}</h3>
          <p className="text-white">{props.description}</p>
          <p className="text-white">{shortenAddress(props.owner)}</p>

          <div className="flex justify-between mt-4">
            {/* <div>
              <h3 className="text-white text-sm">Floor</h3>
              <h3 className="text-white">&lt; 0.01</h3>
            </div> */}
            <div>
              <h3 className="text-white text-sm">Total Volumess</h3>
              <h3 className="text-white">
                {props.nfts.reduce((acc, nft) => acc + nft.price, 0)} ETH
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
