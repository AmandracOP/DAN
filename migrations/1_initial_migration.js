const Migrations = artifacts.require('Migrations');
const DanContract = artifacts.require('DanContract');

module.exports = function (deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(DanContract);
};
