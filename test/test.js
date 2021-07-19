const { expect } = require("chai");
const BigNumber = require('bignumber.js');

describe("Token contract", function () {
    let purchaseFactory;
    let purchase;
    let nftreeFactory;
    let nftree
    let mycoinFactory;
    let mycoin
    let owner;
    let customer;
    let wallet;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async function () {
    // Get the ContractFactory and Signers here.
    [owner, customer, wallet] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    purchaseFactory = await ethers.getContractFactory("Purchase");
    purchase = await purchaseFactory.deploy();
    //console.log('Purchase contract deployed to: ', purchase.address);
    
    nftreeFactory = await ethers.getContractFactory("NFTree");
    nftree = await nftreeFactory.deploy();
    //console.log('NFTree contract deployed to: ', nftree.address);

    mycoinFactory = await ethers.getContractFactory("Mycoin");
    mycoin = await mycoinFactory.deploy(); 
    //console.log('Mycoin contract deployed to: ', mycoin.address);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await purchase.owner()).to.equal(owner.address);

      expect(await nftree.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    it("Should initialize correctly", async function () {
        // set the Purchase contract address in the NFTree contract
        await nftree.setPurchaseContract(purchase.address);
        expect(await nftree.getPurchaseContract()).to.equal(purchase.address);

        // set the NFTree contract address in the Purchase contract
        await purchase.setNFTreeContract(nftree.address);
        expect(await purchase.getNFTreeContract()).to.equal(nftree.address);

        // set the offramp wallet in the Purchase contract
        await purchase.setOfframpWallet(wallet.address);
        expect(await purchase.getOfframpWallet()).to.equal(wallet.address);

        // mint customer mycoin
        await mycoin.mint(customer.address);
        expect(await mycoin.balanceOf(customer.address)).to.equal(web3.utils.toWei('1000','ether'));
    });

    it("Should set variables correctly", async function () {
        // add mycoin token address to purchase contract
        await purchase.addToken(mycoin.address, 'USDT');
        console.log(await purchase.getCoins());

        // set token hashes 
        await purchase.setTokenHash(1, 'Level 1 Hash');
        await purchase.setTokenHash(10, 'Level 10 Hash');
        await purchase.setTokenHash(100, 'Level 100 Hash');
        await purchase.setTokenHash(1000, 'Level 1000 Hash');
        await purchase.setTokenHash(10000, 'Level 10000 Hash');

        // get token hashes
        expect(await purchase.getTokenHash(1)).to.equal('Level 1 Hash');
        expect(await purchase.getTokenHash(10)).to.equal('Level 10 Hash');
        expect(await purchase.getTokenHash(100)).to.equal('Level 100 Hash');
        expect(await purchase.getTokenHash(1000)).to.equal('Level 1000 Hash');
        expect(await purchase.getTokenHash(10000)).to.equal('Level 10000 Hash');
        
    });

    it("Should purchase correctly", async function () {
        // get approval to use customers mycoin tokens
        await mycoin.connect(customer).approve(purchase.address, web3.utils.toWei('1000','ether'));
        expect(await mycoin.allowance(customer.address, purchase.address)).to.equal(web3.utils.toWei('1000','ether'));

        // purchase NFTree
        await purchase.connect(customer).buyNFTree(1, web3.utils.toWei('10','ether'), 'USDT');
        console.log(await nftree.tokensOfOwner(customer.address));
        console.log(await nftree.tokenURI(1));
    });

    it("Should offramp correctly", async function () {
        expect(await mycoin.balanceOf(wallet.address)).to.equal(web3.utils.toWei('10','ether'));

    });

  });
});
