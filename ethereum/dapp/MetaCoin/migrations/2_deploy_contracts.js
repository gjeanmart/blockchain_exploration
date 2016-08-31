module.exports = function(deployer) {

  deployer.deploy(ConvertLib.sol);
  deployer.autoLink();
  deployer.deploy(MetaCoin.sol);
};
