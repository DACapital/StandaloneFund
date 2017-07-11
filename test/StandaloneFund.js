var StandaloneFund = artifacts.require('./StandaloneFund.sol')

contract('StandaloneFund', function (accounts) {
  it('should pass', function () {
    assert.equal(10000, 10000, '10000 is 10000')
  })
})
