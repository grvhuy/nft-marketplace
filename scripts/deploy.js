const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  // const IPDB = await hre.ethers.getContractFactory("IPDB");
  // const ipdb = await IPDB.deploy();
  // await ipdb.deployed();
  // console.log("IPDB deployed to:", ipdb.address);

  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();

  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const marketplaceAddress = "${nftMarketplace.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
