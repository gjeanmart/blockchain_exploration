pragma solidity ^0.4.4;

contract Ownable {
  address public owner;

  function Ownable() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender == owner) {
      _;
	}
  }
}

