const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
// init provider from ganache network
const provider = ganache.provider()
// import compiled contract code
const { interface, bytecode } = require('../compile')

// create instance of web3 with ganache provider
const web3 = new Web3(provider)
const INIT_STRING = 'hello world'
let accounts
let inbox

// run before each test
beforeEach(async () => {
  // get list of accounts from ganache network
  accounts = await web3.eth.getAccounts()

  // deploy with contract code
  // set initial message with argument prop
  // send transaction to create contract
  // specify account and gas limit
  inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode, arguments: [ INIT_STRING ] })
  .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider)
})

describe('Inbox', () => {
  // verify that contract has an address
  it('deploys contract', () => {
    assert.ok(inbox.options.address)
  })

  // verify that the initial message was set
  it('has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, INIT_STRING)
  })

  // test that the message can be updated using contract method
  it('can change the message', async () => {
    const NEW_MESSAGE = 'new world'

    await inbox.methods.setMessage(NEW_MESSAGE)
    .send({ from: accounts[0] })

    const newMessage = await inbox.methods.message().call()
    assert.equal(newMessage, NEW_MESSAGE)
  })
})
