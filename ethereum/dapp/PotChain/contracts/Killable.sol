pragma solidity ^0.4.4;

import './Ownable.sol';


contract Killable is Ownable {
  function kill() {
    if (msg.sender == owner) { suicide(owner); }
  }
}