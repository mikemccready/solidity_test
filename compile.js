const path = require('path');
const fs = require('fs');
const solc = require('solc');

// read file stream from contracts
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol')

const source = fs.readFileSync(lotteryPath, 'utf8');

// pass file stream to solidity compiler, export contract
module.exports = solc.compile(source, 1).contracts[':Lottery'];
