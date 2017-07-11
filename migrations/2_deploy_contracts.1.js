/* global artifacts */
var StandaloneFund = artifacts.require('./StandaloneFund.sol')

module.exports = function (deployer) {
  deployer.deploy(StandaloneFund)
}
