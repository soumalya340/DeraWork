const fs = require("fs")
const { ethers, run, network } = require("hardhat")

async function main() {
    const account = await ethers.getSigner() 
    
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

    // DAI
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

     /// fetching the abi
    const tokenArtifact = await artifacts.readArtifact("IToken")

    const daiContract = await ethers.getContractAt(tokenArtifact.abi,DAI,account);

    const balance1 = await daiContract.balanceOf(account.address)

    console.log(`The DAI balance before is ${balance1}`);
    //// WETH

    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const wethArtifact = await artifacts.readArtifact("IWeth")

    const wethContract = await ethers.getContractAt(wethArtifact.abi,WETH,account);

    const transactionResponseWeth = await wethContract.balanceOf(account.address)
    console.log(`The WETH balance before is ${transactionResponseWeth}`);

    await wethContract.deposit({value : ethers.utils.parseEther("20.0")})

    const balanceWeth = await wethContract.balanceOf(account.address)

    console.log(`TheWETH balance is ${balanceWeth}`);
    /// UNISWAP FOR DAI
  
    let value =  "1000000000000000000";
    const SwapFactory = await hre.ethers.getContractFactory("Swap")
    const Swap = await SwapFactory.deploy()
    await wethContract.approve(Swap.address,value)

    const transactionResponse1 = await Swap.swapExactInputSingleHop(WETH,DAI,3000,value)
    await transactionResponse1.wait()
    const balance2 = await daiContract.balanceOf(account.address)
    console.log(`The ${account.address} balance after is ${ethers.utils.formatEther(balance2)} DAI`);

    //0xd5bAd7c89028B3F7094e40DcCe83D4e6b3Fd9AA4
    // TREASURY
    const vault = "0xd5bAd7c89028B3F7094e40DcCe83D4e6b3Fd9AA4"
    const TreasuryFactory = await hre.ethers.getContractFactory("Treasury")
    const Treasury = await TreasuryFactory.deploy(DAI,USDT,USDC)

    await daiContract.approve(Treasury.address,balance2)
    console.log(`The value is ${await daiContract.balanceOf(Treasury.address)}`);
    await Treasury.depositToken(DAI,balance2)
    console.log(`The value is ${await daiContract.balanceOf(Treasury.address)}`);
    await Treasury.setAllocation(vault,10,0,0)

    await Treasury.depositToProtocol(DAI,vault)

    /// MOO TOKENS
    /// fetching the abi
    const mootokenArtifact = await artifacts.readArtifact("IToken")

    const mooContract = await ethers.getContractAt(tokenArtifact.abi,vault,account);

    const mooBalance = await daiContract.balanceOf(Treasury.address)

    console.log(`The moo balance is ${ethers.utils.formatEther(mooBalance)}`)

    await Treasury.withdrawFromProtocol(vault)

}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        Verified = true
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })