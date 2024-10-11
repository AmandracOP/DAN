const DanContract = artifacts.require("DanContract");

module.exports = async function (deployer) {
    await deployer.deploy(DanContract);
    const instance = await DanContract.deployed();
    console.log("Deployed Contract Address:", instance.address);
};
