"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchCard = (props) => {

  const router = useRouter();

  return (
    <div onClick={() => router.push(`/assets/${props.tokenId}`)} className="cursor-pointer transition-transform transform hover:scale-95 duration-300 w-72">
      <div className="min-w-1/3 mr-4 shadow-md bg-[#3b3b3b] opacity-90 hover:opacity-100 my-4 rounded-2xl">
        <Image
          src={props.image}
          alt="Example Image"
          // chinh w = 100 vw 
          sizes="100vw"
          width={400}
          height={400}
          className="aspect-square object-cover rounded-t-2xl"
        />
        <div className="bg-[#3b3b3b] px-4 py-2 text-lg rounded-2xl">
          <h3 title={props.name} className="text-white font-bold line-clamp-1">{props.name}</h3>
          <h3 className="text-white">Author</h3>

          <div className="flex justify-end mt-4">
            <div>
              <h3 className="text-white text-sm">Price</h3>
              <h3 className="text-white">{props.price} ETH</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
