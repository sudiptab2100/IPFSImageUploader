const IPFSImageUploader = artifacts.require("IPFSImageUploader");

module.exports = function (deployer) {
  deployer.deploy(IPFSImageUploader);
};
