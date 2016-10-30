pragma solidity ^0.4.3;

import  "_validation.sol";

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) Validation.throwIfAddressIsInvalid onlyOwner {
        owner = newOwner;
	}
}