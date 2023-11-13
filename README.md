# Treasury Contract

## Overview

The Treasury Contract is a Solidity smart contract designed for managing the deposits and withdrawals of stablecoins (DAI, USDT, USDC) into various yield-generating vaults. It interfaces with Beefy Finance's Yield Optimizer vaults, allowing users to deposit and withdraw funds with accrued yield. Upon deposit, users receive mooTokens, representing their share in the vault.

## Features

- **Stablecoin Support**: Handles three major stablecoins: DAI, USDT, and USDC.
- **Yield Optimization**: Deposits funds into Beefy Finance vaults to optimize yield.
- **Owner Privileges**: Only the owner can set allocations and withdraw funds from protocols.
- **Yield Tracking**: Tracks and calculates the yield generated from each vault.
- **Event Logging**: Emits events for deposits and withdrawals for transparency and tracking.

## Contract Interfaces

- **IERC20**: Standard interface for ERC20 tokens.
- **IVault**: Custom interface for interacting with Beefy Finance vaults, supporting deposit and withdrawal functions.

## Testing and Scripting

For scripting and testing, we use Ethereum Mainnet forking. This approach allows us to simulate the contract's behavior in a real-world environment, ensuring the accuracy and reliability of our tests. Forking Mainnet is essential for testing interactions with existing protocols and tokens without the need for deploying them in a test environment.

# LAUCH CONTRACT'S

## **Contract Deployment Parameters**

This README file provides an overview of how to fetch contract deployment parameters from a JSON file. The JSON file contains the contract name and constructor parameters required for deploying different contracts. This guide assumes you have a basic understanding of JSON and contract deployment.

## **JSON Format**

The JSON file should have the following format:

**Caution** : Only the parameters should be altered for deployment, not the contract's name in json examples.

`Treasury Contract`

```shell
{
    "constructorParams":{
        "param1" : "0x6B175474E89094C44Da98b954EedeAC495271d0F" // DAI ADDRESS IN ETHEREUM
        "param2" : "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT ADDRESS IN ETHEREUM
        "param3" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"  // USDC ADDRESS IN ETHEREUM
    }
}
```

The `contracts` array contains objects representing each contract. Each contract object has two properties:

-   `contractName`: The name of the contract.
-   `constructorParams`: An array of constructor parameters for the contract.

## **Fetching Parameters**

To fetch the contract deployment parameters from the JSON file, we preferred programming language and JSON parsing library. Here's an example in JavaScript:

```shell
const fs = require("fs")

const scripts = `scripts/deploy/deploy.json`
const data = fs.readFileSync(scripts, "utf8")
const jsonContent = JSON.parse(data)

```

Make sure to replace `scripts` with the path to your actual JSON file.

## **Deploying Contracts**

Once you have fetched the contract deployment parameters, you can use them to deploy the contracts using your preferred method or framework. The deployment process will depend on the specific blockchain platform you are using (e.g., Ethereum, Binance Smart Chain, etc.) and the development tools you have chosen (e.g., Truffle, Hardhat, etc.).

Please refer to the documentation or resources provided by your chosen platform and development tools for detailed instructions on deploying contracts programmatically.

To launch the contracts using current Json file , use command

```shell
yarn launch --network $NETWORK
```

or

For local deployement

```shell
yarn launch
```


## Setup and Installation

Before deploying the contract, ensure you have the following:
- Node.js and npm installed.
- Truffle or Hardhat for compiling and deploying.
- Ethereum wallet with ETH for deployment.

To deploy the contract, follow these steps:
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file with necessary environment variables (e.g., wallet private key, Infura API key).
4. Compile the contract using `truffle compile` or `npx hardhat compile`.
5. Deploy to the desired network using `truffle migrate --network <network_name>` or `npx hardhat run scripts/deploy.js --network <network_name>`.

## Functions

### Public and External

- `depositToken(address token, uint256 amount)`: Deposit specified amount of tokens into the Treasury.
- `withdraw(address token)`: Withdraw specified token from the Treasury (owner only).
- `calculateTotalYield()`: Returns the total yield generated from all vaults.

### Owner Only

- `setAllocation(address vault, uint256 daiPercentage, uint256 usdcPercentage, uint256 usdtPercentage)`: Sets the allocation for each token in a specified vault.
- `depositToProtocol(address token, address vault)`: Deposits tokens into a specific vault.
- `withdrawFromProtocol(address vault)`: Withdraws all funds from a specific vault.

## Events

- `UserDeposit`: Emitted when a user deposits tokens.
- `VaultDeposit`: Emitted when tokens are deposited into a vault.
- `VaultWithdraw`: Emitted when tokens are withdrawn from a vault.



## **Conclusion**

This guide has provided an overview of how to fetch contract deployment parameters from a JSON file. By following these steps, you can easily retrieve the contract name and constructor parameters required for deploying different contracts programmatically.


## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
