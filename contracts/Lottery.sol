pragma solidity ^0.4.17;

contract Lottery {
  // init manager and players array with 'address' type
  address public manager;
  address[] public players;

  function Lottery() public {
    // on init, set the senders address as manager
    manager = msg.sender;
  }

  function enter() public payable {
    /* require that entrants attach value
    of at least .01 eth to join the player array */
    require(msg.value > 0.01 ether);
    players.push(msg.sender);
  }

  function random() private view returns (uint) {
    // pseudo random generator with hash function
    return uint(keccak256(block.difficulty, now, players));
  }

  function pickWinner() public restricted {
    /* restricted modifier lets only the manager
    execute the entirety of this function
    a random player is picked and contract balance transfered to them
    players array is reset */
    uint index = random() % players.length;
    players[index].transfer(this.balance);
    players = new address[](0);
  }

  function getPlayers() public view returns (address[]) {
    return players;
  }

  modifier restricted() {
    // runs require statement before code in the function block
    require(msg.sender == manager);
    _;
  }
}
