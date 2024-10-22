"use client";
import { Button } from "@/components/ui/button";
import MetamaskIcon from "@/components/MetamaskIcon";
import Image from "next/image";

const ConnectWalletPage = () => {
  return (
    <div className="mx-20 min-h-screen">

      <div className="mx-24 mt-8 flex flex-col justify-center items-center space-x-2">
      <h1 className="text-white text-5xl font-bold">Connect Your Wallet</h1>
      <h2 className="text-white font-semibold mb-8 mt-2">Connect one of our available wallet providers or create a new wallet</h2>
        <Button className="bg-[#dddddd] font-bold p-6 text-black hover:text-white transform transition-transform duration-300 hover:scale-95">
          <Image src="/images/metamask-icon.svg" width={40} height={40} />
          &nbsp;Metamask
        </Button>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
