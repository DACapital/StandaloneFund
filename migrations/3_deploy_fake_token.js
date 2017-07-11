/* global artifacts */
var FakeToken = artifacts.require('./FakeToken.sol')

module.exports = function (deployer) {
  deployer.deploy(FakeToken)
}
