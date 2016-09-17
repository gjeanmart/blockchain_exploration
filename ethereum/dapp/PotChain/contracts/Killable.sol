import './Ownable.sol';


contract Killable is Ownable {
  function kill() {
    if (msg.sender == owner) { suicide(owner); }
  }
}