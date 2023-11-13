const fs = require("fs")
const { ethers, run, network } = require("hardhat")

async function main() {
    const account = await ethers.getSigner() 
    
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    const DAI= "0x6B175474E89094C44Da98b954EedeAC495271d0F";

     /// fetching the abi
    const tokenArtifact = await artifacts.readArtifact("IToken")

    const usdcContract = await ethers.getContractAt(tokenArtifact.abi,USDC,account);

    const balance1 = await usdcContract.balanceOf(account.address)

    console.log(`The USDC balance before is ${balance1}`);
    //// WETH

    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const wethArtifact = await artifacts.readArtifact("IWeth")

    const wethContract = await ethers.getContractAt(wethArtifact.abi,WETH,account);

    await wethContract.deposit({value : ethers.utils.parseEther("2.0")})
    /// UNISWAP FOR DAI
  
    let value1 =  "1000000000000000000";
    const SwapFactory1 = await hre.ethers.getContractFactory("Swap")
    const Swap1 = await SwapFactory1.deploy()
    await wethContract.approve(Swap.address,value1)

    const transactionResponse2 = await Swap.swapExactInputSingleHop(WETH,DAI,3000,value)
    await transactionResponse2.wait()
    const balance = await daiContract.balanceOf(account.address)
    console.log(`The ${account.address} balance after is ${ethers.utils.formatEther(balance)} DAI`);
    /// UNISWAP FOR USDC
  
    let value =  "1000000000000000000";
    const SwapFactory = await hre.ethers.getContractFactory("Swap")
    const Swap = await SwapFactory.deploy()
    await wethContract.approve(Swap.address,value)

    const transactionResponse1 = await Swap.swapExactInputSingleHop(WETH,USDC,100,value)
    await transactionResponse1.wait()
    const balance2 = await usdcContract.balanceOf(account.address)
    console.log(`The ${account.address} balance after is ${ethers.utils.formatEther(balance2)} USDC`);

    //0xd5bAd7c89028B3F7094e40DcCe83D4e6b3Fd9AA4
    // TREASURY
    const vault = "0xb0018cfD5739912318Cc27d7a68a233F826DCE0b"
    const TreasuryFactory = await hre.ethers.getContractFactory("Treasury")
    const Treasury = await TreasuryFactory.deploy(DAI,USDT,USDC)

    await daiContract.approve(Treasury.address,balance2)
    console.log(`The value is ${await usdcContract.balanceOf(Treasury.address)}`);
    await Treasury.depositToken(USDC,balance2)
    console.log(`The value is ${await usdcContract.balanceOf(Treasury.address)}`);
    await Treasury.setAllocation(vault,0,50,0)

    // await Treasury.depositToProtocol(USDC,vault)

    /// MOO TOKENS
    /// fetching the abi
    // const mootokenArtifact = await artifacts.readArtifact("IToken")

    // const mooContract = await ethers.getContractAt(tokenArtifact.abi,vault,account);

    // const mooBalance = await daiContract.balanceOf(Treasury.address)

    // console.log(`The moo balance is ${ethers.utils.formatEther(mooBalance)}`)

    // await Treasury.withdrawFromProtocol(vault)

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