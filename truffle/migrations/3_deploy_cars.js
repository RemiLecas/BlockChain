const CarsContract = artifacts.require("CarsContract");

module.exports = function (deployer) {
  deployer.deploy(CarsContract);
};
