var SimpleTicket = artifacts.require("./SimpleTicket.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleTicket,0,1,0,1,1,100,{gas: 1000000});
};