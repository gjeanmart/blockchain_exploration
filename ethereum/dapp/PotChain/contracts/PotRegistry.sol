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
	uint 						 	public nbPots;
	address 					 	public lastCreated;
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
		lastCreated = newPotAddress;
		
		return newPotAddress;
	}
	 
	function getPot(address _address) constant returns (address, bytes32, bytes32)  {
	
		// Check if the pot exists in the registry
		//TODO
		
		return (pots[_address].contractAddress, pots[_address].name, pots[_address].description);
	}

	function getPots(uint _pageNo, uint _pageSize) constant returns (address[], bytes32[], bytes32[], uint) {
	
		var (start, end) = calculateWindow(_pageNo, _pageSize);
		
		// Init outout arrays
		address[] 	memory potAddressArray 	= new address[](end-start);
		bytes32[] 	memory potNameArray 	= new bytes32[](end-start);
		bytes32[] 	memory potDescArray		= new bytes32[](end-start);

		// Calculate the window
		for (uint i = start; i < end; i++) { 
			address potAddress = potsID[i];
			PotMetadata memory pot = pots[potAddress];
		
			potAddressArray[i] 	= pot.contractAddress;
			potNameArray[i] 	= pot.name;
			potDescArray[i] 	= pot.description;
		}
		
		return (potAddressArray, potNameArray, potDescArray, nbPots);
	}
	/***********************/
	
	/***********************
	 * Private Functions	   
	 */
	 function calculateWindow(uint _pageNo, uint _pageSize) constant returns (uint, uint) { 
		uint start; 
		uint end; 
		
		if(nbPots == 0) {
			return (0,0);
		}
		
		// Default values
		if(_pageNo < 1) {
			_pageNo = DEFAULT_PAGE_NO;
		}
		if(_pageSize < 1) {
			_pageSize = DEFAULT_PAGE_SIZE;
		}
		
		// Calculate min bound
		start = (_pageNo - 1) * _pageSize;
		
		// Calculate max bound
		if(int(nbPots - (_pageNo * _pageSize)) > 0) {
			end = (_pageNo * _pageSize);
		} else {
			end = nbPots; 
		}
		
		// Out of bound
		if(start > end) {
			return (0,0);
		}
		
		return (start, end);
	}
	/***********************/
}