require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const RINKBEY_RPC_URL = process.env.RINKBEY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
      hardhat: {
        chain: 31337,
        blockConfirmations: 1,
        
        
      },
      rinkeby:{
        chain: 4,
        blockConfirmations: 1,
        url:RINKBEY_RPC_URL,
        accounts: [PRIVATE_KEY],
      }
    },
    solidity: "0.8.8",
    namedAccounts: {
        deployer:{
          default: 0,
        },
        player:{
          default: 1.
        },
    },
}
