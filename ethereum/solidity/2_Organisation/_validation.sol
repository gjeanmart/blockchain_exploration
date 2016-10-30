pragma solidity ^0.4.3;

library Validation {
	
	/*
	 * isValidAddress
	 * @description: check if address is valid
	 * @param: _x the address to check
	 * @return: true if valid, false otherwise
	 */
	function isValidAddress(address _x) returns (bool) {
		if(_x == 0x0) {
			return false;
		} else {
			return true;
		}
	}
	
	/*
	 * isEmptyString
	 * @description: check if string is valid
	 * @param: _x the string to check
	 * @return: true if valid, false otherwise
	 */
	function isEmptyString(string _x) returns (bool) {
		if(bytes(_x).length == 0) {
			return false;
		} else {
			return true;
		}
	}
	
	/*
	 * isEmptyByte32
	 * @description: check if byte32 is valid
	 * @param: _x the byte32 to check
	 * @return: true if valid, false otherwise
	 */
	function isEmptyByte32(byte32 _x) returns (bool) {
		f(_x == "") {
			return false;
		} else {
			return true;
		}
	}
	
	/*
	 * refundEtherSentByAccident
	 * @description: throws if ether was sent accidentally
	 */
	modifier refundEtherSentByAccident() {
		if(msg.value > 0) throw;
		_;
	}
	
	/*
	 * throwIfAddressIsInvalid
	 * @description: throw if an address is invalid
	 * @param: _x the address to check
	 */
	modifier throwIfAddressIsInvalid(address _x) {
		if(isValidAddress(_x) == false) throw;
		_;
	}
}
