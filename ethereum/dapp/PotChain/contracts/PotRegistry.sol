import './Common.sol';

/**
 * Pot
 */
contract PotRegistry {

	/***********************
	 * Structure		   
	 */
    struct PotMetadata {
        address 	contractAddress;
		bytes32 	name;
		bytes32 	description;
    }
	/***********************/

	
	/***********************
	 * Data				   
	 */
	// Constant
	uint constant DEFAULT_PAGE_NO = 1;
	uint constant DEFAULT_PAGE_SIZE = 10;
	
	// Variables
	mapping(address => PotMetadata) pots;
	uint 						 	nbPots;
	address 					 	lastCreated;
	/***********************/
	
	
	/***********************
	 * Functions	   
	 */
	function createPot(bytes32 _name, bytes32 _description, uint _endDate, uint _goal) returns (address) {
		address newPotAddress = new Pot(_name, _description, _endDate, _goal);
		
		PotMetadata memory metadata; 
		metadata.name 				= _name;
		metadata.description 		= _description;
		metadata.contractAddress 	= newPotAddress;
		
		pots[newPotAddress] = metadata;
		
		nbPots += 1;
		
		return newPotAddress;
	}
	 
	function getPot(address _address) isEnded constant returns (address, uint, bytes32, bytes32)  {
	
		// Check if the pot exists in the registry
		//TODO
		
		return (pots[_address].contractAddress, pots[_address].id, pots[_address].name, pots[_address].description);
	}

	function getPots(uint pageNo, uint pageSize) constant returns (address[], bytes32[], bytes32[]) {
	
		// Default values
		if(pageNo < 1) {
			pageNo = DEFAULT_PAGE_NO;
		}
		if(pageSize < 1) {
			pageNo = DEFAULT_PAGE_SIZE;
		}
		
		// Calculate final length
		uint length = nbPots;
		if(length < pageSize) {
			length = pageSize;
		}
		
		// Init outout array
		address[] 	memory potAddressArray 	= new address[](length);
		bytes32[] 	memory potNameArray 	= new bytes32[](length);
		bytes32[] 	memory potDescArray		= new bytes32[](length);

		// Calculta the window
		uint start = (pageNo - 1) * length;
		uint end = pageNo * length;
		
		for (var i = start; i < end; i++) { 
			Pot memory pot = pots[i];
		
			potAddressArray[i] 	= pot.contractAddress;
			potNameArray[i] 	= pot.name;
			potDescArray[i] 	= pot.description;
		}
		
		return (potAddressArray, potNameArray, potDescArray);
	}
	/***********************
	
	
}