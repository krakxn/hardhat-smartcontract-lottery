const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig,  } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("0.1")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        //fund the subscription
        //usually you need the link token  on a real network
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callBackGasLimit,
        interval,
    ]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        logs: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }

    log("-----------------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]
