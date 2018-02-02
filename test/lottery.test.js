const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()
const web3 = new Web3(provider)
// import compiled contract code
const { interface, bytecode } = require('../compile')

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode })
  .send({ from: accounts[0], gas: '1000000' })
  console.log('before', accounts[0])

  lottery.setProvider(provider)
})

describe('Lottery', () => {
  it('deploys contract', () => {
    assert.ok(lottery.options.address)
  })

  it('allows an account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    assert.equal(1, players.length)
    assert.equal(accounts[0], players[0])
  })

  it('allows multiple account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    })

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    assert.equal(3, players.length)
    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
  })

  it('requires min ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      })
      assert(false)
    } catch (err) {
      const players = await lottery.methods.getPlayers().call({
        from: accounts[0],
      })
      assert.equal(0, players.length)
    }
  })

  it('only manager can pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('sends money to winner and resets array', async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('2', 'ether')
    })

    const initBalance = await web3.eth.getBalance(accounts[1])
    await lottery.methods.pickWinner().send({ from: accounts[0] })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })

    const finalBalance = await web3.eth.getBalance(accounts[1])
    const accountChange = finalBalance - initBalance

    assert.equal(0, players.length)
    assert(accountChange > web3.utils.toWei('1.8', 'ether'))
  })

})
