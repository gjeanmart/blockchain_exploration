import './Pot.sol';

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
	mapping(uint 	=> address) 	potsID;
	uint 						 	nbPots;
	address 					 	lastCreated;
	/***********************/
	
	
	/***********************
	 * Functions	   
	 */
	function createPot(bytes32 _name, bytes32 _description, uint _endDate, uint256 _goal, address _recipient) returns (address) {
		address newPotAddress = new Pot(msg.sender, _name, _description, _endDate, _goal, _recipient);
		
		PotMetadata memory metadata; 
		metadata.name 				= _name;
		metadata.description 		= _description;
		metadata.contractAddress 	= newPotAddress;
		
		pots[newPotAddress] = metadata;
		potsID[nbPots]		= newPotAddress;
		
		nbPots += 1;
		
		return newPotAddress;
	}
	 
	function getPot(address _address) constant returns (address, bytes32, bytes32)  {
	
		// Check if the pot exists in the registry
		//TODO
		
		return (pots[_address].contractAddress, pots[_address].name, pots[_address].description);
	}

	function getPots(uint _pageNo, uint _pageSize) constant returns (address[], bytes32[], bytes32[], uint) {
	
		// Default values
		if(_pageNo < 1) {
			_pageNo = DEFAULT_PAGE_NO;
		}
		if(_pageSize < 1) {
			_pageSize = DEFAULT_PAGE_SIZE;
		}
		
		// Calculate final length
		uint length = nbPots;
		if(length > _pageSize) {
			length = _pageSize;
		}
		
		// Init outout arrays
		address[] 	memory potAddressArray 	= new address[](length);
		bytes32[] 	memory potNameArray 	= new bytes32[](length);
		bytes32[] 	memory potDescArray		= new bytes32[](length);

		// Calculate the window
		for (uint i = (_pageNo - 1) * length; i < _pageNo * length; i++) { 
			address potAddress = potsID[i];
			PotMetadata memory pot = pots[potAddress];
		
			potAddressArray[i] 	= pot.contractAddress;
			potNameArray[i] 	= pot.name;
			potDescArray[i] 	= pot.description;
		}
		
		return (potAddressArray, potNameArray, potDescArray, nbPots);
	}
	/***********************/
	
	
}