require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()
require("./tasks/tasks");

const INFURA_API_KEY = "782109c6748c48d6b91c3eafa72b5292";

const METAMASK_PRIVATE_KEY = "4e5b143543443e896867ae6257d15f5276f7af00a34a0e5a5cd721c6aef02d5b";

const ETHERSCAN_API_KEY = "NDKJ13HJPXBGN9AD9DQKJH25W1FDC86IDR";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    artifacts: './nftrees-app/src/artifacts',
  }
};
