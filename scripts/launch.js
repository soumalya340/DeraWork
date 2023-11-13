const fs = require("fs")
const { ethers, run, network } = require("hardhat")

const scripts = `scripts/launch.json`
const data = fs.readFileSync(scripts, "utf8")
const jsonContent = JSON.parse(data)

let contractAddress
let blockNumber
let Verified = false


async function main() {
    const constructorParam = jsonContent.constructorParams

    const TreasuryFactory = await hre.ethers.getContractFactory(
        "Treasury"
    )
    const Treasury = await TreasuryFactory.deploy(
        constructorParam.param1,
        constructorParam.param2,
        constructorParam.param3,
    )
    await Treasury.deployed()
    console.log(`Treasury Deployed  to : ${Treasury.address}`)
    //console.log(Treasury)
    contractAddress = Treasury.address
    blockNumber = Treasury.provider._maxInternalBlockNumber

    ///VERIFY
    if (hre.network.name != "hardhat") {
        await Treasury.deployTransaction.wait(6)
        await verify(Treasury.address, [
            constructorParam.param1,
            constructorParam.param2,
            constructorParam.param3,        
        ])
    }
    let chainId

    if (network.config.chainId != undefined) {
        chainId = network.config.chainId
    } else {
        chainId = network.config.networkId
    }

    console.log(`The chainId is ${chainId}`)
    const data = { chainId, contractAddress, Verified, blockNumber }
    const jsonString = JSON.stringify(data)
    // Log the JSON string
    console.log(jsonString)
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
