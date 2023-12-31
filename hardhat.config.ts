require("dotenv").config();
import dotenv from "dotenv"
dotenv.config();
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-truffle5"
import "@nomiclabs/hardhat-waffle"
import "hardhat-gas-reporter"
import "solidity-coverage"

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'

import { task } from "hardhat/config"

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// TESTNET
const MATICMUM_RPC_URL = process.env.MATICMUM_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/api-key"
// MAINNET
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/api-key"
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/api-key"

const MNEMONIC = process.env.MNEMONIC || "ajkskjfjksjkf ssfaasff asklkfl klfkas dfklhao asfj sfk klsfjs fkjs"
const PRIVATE_KEY = process.env.PRIVATE_KEY

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "lklsdkskldjklgdklkld"

module.exports = {
  solidity : {
      compilers: [
        {
          version: "0.8.17",
        },
        {
            version: "0.5.12",
        },      
      ],
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: ETHEREUM_RPC_URL,
      },
    },
    // TESTNET NETWORKS
    maticmum: {
      networkId: 80001,
      url: MATICMUM_RPC_URL,
      accounts: [PRIVATE_KEY],
      // accounts: {
      //   mnemonic: MNEMONIC,
      // },
    },
    // MAINNET NETWORKS
    polygon: {
      networkId: 137,
      url: POLYGON_RPC_URL,
      // accounts: [`0x${ETH_PRIVATE_KEY}`],
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};