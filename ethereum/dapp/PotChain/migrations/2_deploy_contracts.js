module.exports = function(deployer) {
  deployer.deploy(PotRegistry);
  deployer.autolink();
};
