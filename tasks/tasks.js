require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const fs = require('fs');
const purchaseABI = require("../nftrees-app/src/artifacts/contracts/Purchase.sol/Purchase.json").abi;
const nftreeABI = require("../nftrees-app/src/artifacts/contracts/NFTree.sol/NFTree.json").abi;
const daiABI = require("../nftrees-app/src/artifacts/contracts/DAI.sol/DAI.json").abi;
const usdcABI = require("../nftrees-app/src/artifacts/contracts/USDC.sol/USDC.json").abi;
const usdtABI = require("../nftrees-app/src/artifacts/contracts/USDT.sol/USDT.json").abi;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
  
    for (const account of accounts) {
      console.log(account.address);
    }
  });

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

task("init", "Initializes contracts")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    var purchase = new web3.eth.Contract(purchaseABI, process.env.PURCHASE_ADDRESS);
    var nftree = new web3.eth.Contract(nftreeABI, process.env.NFTREE_ADDRESS);

    // set offramp wallet 
    await purchase.methods.setOfframpWallet(process.env.OFFRAMP_WALLET).send({from: owner.address});

    // set purchase address in nftree contract
    await nftree.methods.setPurchaseContract(process.env.PURCHASE_ADDRESS).send({from: owner.address});

    // set nftree address in purchase contract
    await purchase.methods.setNFTreeContract(process.env.NFTREE_ADDRESS).send({from: owner.address});

    // set token hashes
    await purchase.methods.setTokenHash("1", process.env.TOKEN_URI_1).send({from: owner.address});
    await purchase.methods.setTokenHash("10", process.env.TOKEN_URI_2).send({from: owner.address});
    await purchase.methods.setTokenHash("100", process.env.TOKEN_URI_3).send({from: owner.address});
    await purchase.methods.setTokenHash("1000", process.env.TOKEN_URI_4).send({from: owner.address});
  });

task("getInformation", "Retrieves contract information")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    var purchase = new web3.eth.Contract(purchaseABI, process.env.PURCHASE_ADDRESS);
    var nftree = new web3.eth.Contract(nftreeABI, process.env.NFTREE_ADDRESS);

    // get offramp wallet
    console.log("Offramp wallet:", await purchase.methods.getOfframpWallet().call());

    //get purchase contract
    console.log("Purchase contract:", await nftree.methods.getPurchaseContract().call());

    //get nftree contract
    console.log("NFTree contract:", await purchase.methods.getNFTreeContract().call());

    // get token hashes
    console.log("Token URI 1:", await purchase.methods.getTokenHash(1).call());
    console.log("Token URI 10:", await purchase.methods.getTokenHash(10).call());
    console.log("Token URI 100:", await purchase.methods.getTokenHash(100).call());
    console.log("Token URI 1000:", await purchase.methods.getTokenHash(1000).call());

    // get coins
    console.log("coin list:", await purchase.methods.getCoins().call());
});

task("addToken", "Add token to purchase contract")
  .addParam("address", "Address of token")
  .addParam("token", "Name of token")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    var purchase = new web3.eth.Contract(purchaseABI, process.env.PURCHASE_ADDRESS);

    // add token to nftree contract
    await purchase.methods.addToken(taskArgs.address, taskArgs.token).send({from: owner.address});
});

task("mint", "Mint token to address")
  .addParam("token", "Name of token")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    if(taskArgs.token == 'DAI'){
      var dai = new web3.eth.Contract(daiABI, process.env.DAI_ADDRESS);

      // mint token to owner
      await dai.methods.mint(owner.address).send({from: owner.address});
      var balance = await dai.methods.balanceOf(owner.address).call();
      console.log("DAI balance:", web3.utils.fromWei(balance, 'ether'));
    }
    else if (taskArgs.token == 'USDC') {
      var usdc = new web3.eth.Contract(usdcABI, process.env.USDC_ADDRESS);

      // mint token to owner
      await usdc.methods.mint(owner.address).send({from: owner.address});
      var balance = await usdc.methods.balanceOf(owner.address).call();
      console.log("USDC balance:", web3.utils.fromWei(balance, 'ether'));
    }
    else if (taskArgs.token == 'USDT') {
      var usdt = new web3.eth.Contract(usdtABI, process.env.USDT_ADDRESS);

      // mint token to owner
      await usdt.methods.mint(owner.address).send({from: owner.address});
      var balance = await usdt.methods.balanceOf(owner.address).call();
      console.log("USDT balance:", web3.utils.fromWei(balance, 'ether'));
    } else {
      console.log('enter valid coin');
    }
});

task("purchaseNFTree", "Purchase an nftree")
  .addParam("num", "Number of credits to purchase")
  .addParam("amount", "Amount of token")
  .addParam("token", "Name of token")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();
    console.log(owner.address);

    // create contract instances
    var purchase = new web3.eth.Contract(purchaseABI, process.env.PURCHASE_ADDRESS);
    var nftree = new web3.eth.Contract(nftreeABI, process.env.NFTREE_ADDRESS);
    var mycoin = new web3.eth.Contract(mycoinABI, process.env.MYCOIN_ADDRESS);

    // approve tokens to be used
    await mycoin.methods.approve(process.env.PURCHASE_ADDRESS, web3.utils.toWei(taskArgs.amount, "ether")).send({from: owner.address});

    // purchase nftree
    await purchase.methods.buyNFTree(taskArgs.num, web3.utils.toWei(taskArgs.amount, "ether"), taskArgs.token).send({from: owner.address});
    let balance = await nftree.methods.balanceOf(owner.address).call();
    console.log(web3.utils.fromWei(balance, 'ether'));
});


module.exports = {};