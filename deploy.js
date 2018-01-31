const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
// import compiled contract
const { interface, bytecode } = require('./compile.js')
// import metaPhrase, infuraNetwork config
const { metaPhrase, infuraNetwork } = require('./config.js')

// set source of eth
// specify which network node to connect
const provider = new HDWalletProvider(
  metaPhrase,
  infuraNetwork
)

// init web3 instance with provider
const web3 = new Web3(provider)

const deploy = (async () => {
  // get available accounts
  const accounts = await web3.eth.getAccounts()

  // init new contract with compiled code
  // deploy contract with initial newMessage
  // specify gas limit and source account
  const contract = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode, arguments: [ 'hello world' ] })
  .send({ gas: '1000000', from: accounts[0] })
})()
