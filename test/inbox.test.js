const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()

const { interface, bytecode } = require('../compile')

const web3 = new Web3(provider)
let accounts
let inbox
const INIT_STRING = 'hello world'

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode, arguments: [ INIT_STRING ] })
  .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider)
})

describe('Inbox', () => {
  it('deploys contract', () => {
    assert.ok(inbox.options.address)
  })

  it('has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, INIT_STRING)
  })

  it('can change the message', async () => {
    const NEW_MESSAGE = 'new world'

    await inbox.methods.setMessage(NEW_MESSAGE)
    .send({ from: accounts[0] })

    const newMessage = await inbox.methods.message().call()
    assert.equal(newMessage, NEW_MESSAGE)
  })
})
