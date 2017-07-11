/* global artifacts, contract, it, assert, web3 */
var StandaloneFund = artifacts.require('./StandaloneFund.sol')
var FakeToken = artifacts.require('./FakeToken.sol')

contract('StandaloneFund', (accounts) => {
  let fundContract = null
  let tokenContract = null

  // Just get the deployed instance and save it off
  it('should get instance', () => {
    return StandaloneFund.deployed()
    .then((instance) => {
      // Save off the standalone fund contract
      fundContract = instance
      return FakeToken.deployed()
    })
    .then((instance) => {
      // Save off the testing token contract
      tokenContract = instance
      return tokenContract.transfer(fundContract.address, 5000)
    })
  })

  it('should fail if not the owner on setting for sale', (done) => {
    fundContract.SetForSale(true, {from: accounts[1]})
    .then((result) => {
      done('Should have thrown error')
    }).catch(() => {
      done()
    })
  })

  it('should fail if not the owner on setting price', (done) => {
    fundContract.SetSalePrice(1000, {from: accounts[1]})
    .then((result) => {
      done('Should have thrown error')
    }).catch(() => {
      done()
    })
  })

  it('should fail to purchase if for-sale flag is set to false', (done) => {
    fundContract.SetForSale(false, {from: accounts[0]})
    .then((result) => {
      return fundContract.Purchase({from: accounts[3], value: 10 ** 18})
    })
    .then((result) => {
      done('Should have thrown error')
    }).catch(() => {
      done()
    })
  })

  it('should fail to purchase if payment is below asking price', (done) => {
    fundContract.SetForSale(true, {from: accounts[0]})
    .then((result) => {
      return fundContract.SetSalePrice(1000, {from: accounts[0]})
    })
    .then((result) => {
      return fundContract.Purchase({from: accounts[3], value: 100})
    })
    .then((result) => {
      done('Should have thrown error')
    }).catch(() => {
      done()
    })
  })

  it('should allow basic purchase', () => {
    let beforeBalance = 0

    return fundContract.SetForSale(true, {from: accounts[0]})
    .then((result) => {
      return fundContract.SetSalePrice(1000, {from: accounts[0]})
    })
    .then((result) => {
      beforeBalance = web3.eth.getBalance(accounts[0]).toNumber()
      return fundContract.Purchase({from: accounts[3], value: 1000})
    })
    .then((result) => {
      return fundContract.isForSale.call()
    })
    .then((isForSale) => {
      assert.equal(isForSale.valueOf(), false, 'Should be set back to false after purchase')
      return fundContract.salePrice.call()
    })
    .then((newPrice) => {
      assert.equal(newPrice.valueOf(), 0, 'Should be set back to 0 after purchase')
      return fundContract.owner.call()
    })
    .then((newOwner) => {
      assert.equal(newOwner.valueOf(), accounts[3], 'Should be assigned to the purchaser')
      assert.equal(web3.eth.getBalance(accounts[0]).minus(1000).toNumber(), beforeBalance, 'ETH should get transferred to owner during purchase')

      // Trigger a token withdraw
      return fundContract.WithdrawTokens(tokenContract.address, 250, {from: accounts[3]})
    })
    .then((result) => {
        // Verify the owner got credited tokens
      return tokenContract.balanceOf.call(accounts[3])
    })
    .then((balance) => {
      assert.equal(balance.valueOf(), 250, 'Tokens should have been transferred to the owner')
    })
  })
})
