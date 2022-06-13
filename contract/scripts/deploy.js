const hre = require("hardhat");

async function main() {
    const spotifyCoinFactory = await hre.ethers.getContractFactory("SpotifyCoin")
    const spotifyCoin = await spotifyCoinFactory.deploy()

    await spotifyCoin.deployed()

    console.log("Spotify Coin deployed to:", spotifyCoin.address)
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})