const path = require('path');
const fs = require('fs');
const solc = require('solc');

// read file stream from contract
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// pass file stream to solidity compiler,
// export 'Inbox' contract
module.exports = solc.compile(source, 1).contracts[':Inbox'];
