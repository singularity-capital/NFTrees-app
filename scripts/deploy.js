const hre = require("hardhat");

async function main() {

    // deploy purchase contract
    const Purchase = await hre.ethers.getContractFactory("Purchase");
    const purchase = await Purchase.deploy();

    // deploy NFTree contract
    const NFTree = await hre.ethers.getContractFactory("NFTree");
    const nftree = await NFTree.deploy();

    // deploy DAI contract
    const DAI = await hre.ethers.getContractFactory("DAI");
    const dai = await DAI.deploy();

    // deploy USDC contract
    const USDC = await hre.ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();

    // deploy USDT contract
    const USDT = await hre.ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy();
  
    console.log("Purchase deployed to:", purchase.address);
    console.log("NFTree deployed to:", nftree.address);
    console.log("DAI deployed to:", dai.address);
    console.log("USDC deployed to:", usdc.address);
    console.log("USDT deployed to:", usdt.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });