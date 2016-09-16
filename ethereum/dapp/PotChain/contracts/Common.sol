contract Killable {
  function kill() {
    if (msg.sender == owner) { suicide(owner); }
  }
}

contract Ownable {
  address public owner;

  function Ownable() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender == owner) {
      _
	}
  }
}