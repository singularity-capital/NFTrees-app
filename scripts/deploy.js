const hre = require("hardhat");

async function main() {

    // deploy purchase contract
    const Purchase = await hre.ethers.getContractFactory("Purchase");
    const purchase = await Purchase.deploy();

    // deploy NFTree contract
    const NFTree = await hre.ethers.getContractFactory("NFTree");
    const nftree = await NFTree.deploy();

    // deploy Mycoin contract
    const Mycoin = await hre.ethers.getContractFactory("Mycoin");
    const mycoin = await Mycoin.deploy();
  
    console.log("Purchase deployed to:", purchase.address);
    console.log("NFTree deployed to:", nftree.address);
    console.log("Mycoin deployed to:", mycoin.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });