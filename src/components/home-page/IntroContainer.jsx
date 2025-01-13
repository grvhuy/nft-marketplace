const CollectionContainer = () => {
  return (
    <div className="mx-40 pt-8 mb-8">
      <h1 className="text-white text-4xl font-bold">How It Works</h1>
      <h3 className="text-white text-xl ">Find Out How To Get Started</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 space-x-8">
        <div className="flex flex-col items-center justify-center bg-[#3b3b3b] p-8 rounded-lg text-white">
          <div className="transition-transform transform hover:scale-90  duration-300 ease-in hover:rotate-6">
            <img
              src="/images/wallet.webp"
              alt="Wallet"
              width={200}
              height={200}
              sizes="100vw"
            />
          </div>
          <b className="mb-4 text-xl">Setup Your Wallet</b>
          <p className="text-center">
            Set up your wallet of choice. Connect it to the Animarket by
            clicking the wallet icon in the top right corner.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#3b3b3b] p-8 rounded-lg text-white">
          <div className="transition-transform transform hover:scale-90  duration-300 ease-in hover:rotate-6">
            <img
              src="/images/wallet.webp"
              alt="Wallet"
              width={200}
              height={200}
              sizes="100vw"
            />
          </div>
          <b className="mb-4 text-xl">Create NFTs</b>
          <p className="text-center">
            Upload your work and setup your collection. Add a description,
            social links and floor price.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#3b3b3b] p-8 rounded-lg text-white">
          <div className="transition-transform transform hover:scale-90  duration-300 ease-in hover:rotate-6">
            <img
              src="/images/wallet.webp"
              alt="Wallet"
              width={200}
              height={200}
              sizes="100vw"
            />
          </div>
          <b className="mb-4 text-xl">Start Earning</b>
          <p className="text-center">
            Choose between auctions and fixed-price listings. Start earning by
            selling your NFTs or trading others.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionContainer;
