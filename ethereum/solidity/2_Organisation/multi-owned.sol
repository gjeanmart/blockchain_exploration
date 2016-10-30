pragma solidity ^0.4.3;

import  "_validation.sol";
import  "_arrayutils.sol";

contract multiowned {
	function isOwner(address _addr) returns (bool);
	function listOwners() constant returns (uint[], address[]);
	function addOwner(address _addr) onlyOwner returns (uint);
	function removeOwner(uint _id) onlyOwner returns (bool);
}


contract multiownedImpl {
    address[] public owners;
    uint public maxOwner;

	modifier onlyOwner {
		if (!isOwner(msg.sender)) throw;
		_;
	}
	
    function multiownedImpl(uint _maxOwner) {
        owners.push(msg.sender);
		maxOwner = _maxOwner
    }
	
    function addOwner(address _address) Validation.throwIfAddressIsInvalid onlyOwner returns (bool) {
		if(nbOwners == _maxOwner) throw;
		
        owners.push(_address);
    }
	
    function removeOwner(address _address) Validation.throwIfAddressIsInvalid onlyOwner returns (bool) {
		if(owners.length == 1) throw;
	
		int index = -1;
        for (var i = 0; i < owners.length ; i++) { 
			if(owners[i] == _address) {
				index = i;
			}
        }
		
		if(index == -1) throw;
		
		owners = ArrayUtils.remove(index, owners);
		
		return true;
    }
	
    function isOwner(address _address) Validation.throwIfAddressIsInvalid onlyOwner returns (bool) {
	
        for (var i = 0; i < owners.length ; i++) { 
			if(owners[i] == _address) {
				return true
			}
        }
		
		return false;
    }
}