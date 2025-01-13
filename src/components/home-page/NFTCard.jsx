import Image from "next/image";
import { shortenAddress } from "../../../utils/convert";

const NFTCard = ({ name, author, price, image }) => {
  return (
    <div className="transition-transform transform hover:scale-95 duration-300">
      <div className="min-w-1/3 mr-4 shadow-md bg-[#3b3b3b] opacity-90 hover:opacity-100 my-4 rounded-2xl">
        <Image
          src={image}
          alt="Example Image"
          // chinh w = 100 vw 
          sizes="100vw"
          width={400}
          height={400}
          className="aspect-square object-cover rounded-t-2xl"
        />
        <div className="bg-[#3b3b3b] px-4 py-2 text-lg rounded-2xl">
          <p className="text-white font-bold">{name}</p>
          <p title={author} className="text-white">{shortenAddress(author)}</p>

          <div className="flex justify-end mt-4">
            <div>
              <p className="text-white text-sm">Price</p>
              <p className="text-white font-bold">{price} ETH</p>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
