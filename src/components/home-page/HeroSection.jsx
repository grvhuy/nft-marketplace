import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
const HeroSection = () => {
  return (
    <div className="grid grid-cols-2 mt-8 mx-40">
      <div className="flex flex-col justify-center">
        <h1 className="text-white font-bold text-7xl">Discover Digital Art & Collect Nfts</h1>
        <p className="text-white text-lg mt-6">
          Nft Marketplace Ui Created With Anima For Figma. Collect, Buy And Sell
          Art From More Than 20k Nft Artists.
        </p>
        <Button className="max-w-60 bg-[#a259ff] p-8 font-bold mt-8 rounded-xl transform transition-transform duration-200 hover:scale-95 hover:bg-[#a259ff] ">Get Started</Button>


        <div className="flex justify-between mt-8">
          <p className="flex flex-col">
            <span className="font-bold text-2xl text-white">240K+</span>
            <span className="font-medium text-2xl text-white">Total sell</span>
          </p>
          <p className="flex flex-col">
            <span className="font-bold text-2xl text-white">100k+</span>
            <span className="font-medium text-2xl text-white">Auctions</span>
          </p>
          <p className="flex flex-col">
            <span className="font-bold text-2xl text-white">240k+</span>
            <span className="font-medium text-2xl text-white">Artists</span>
          </p>
        </div>
      </div>
      <div>
        <Image
          unoptimized
          src="https://cdn.animaapp.com/projects/6357ce7c8a65b2f16659918c/files/heroanimationtransparentbck-2.gif"
          alt="hero"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default HeroSection;
