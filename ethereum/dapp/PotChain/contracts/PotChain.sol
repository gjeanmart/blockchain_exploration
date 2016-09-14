import './Common.sol';
/**
 * PotChain
 */
contract PotChain  {

	/***********************
	 * Data				   
	 */
	mapping(uint 	=> Pot) public pots;
	/***********************/
}


/**
 * Pot
 */
contract Pot is Killable {

	/***********************
	 * Structure		   
	 */
    struct Contribution {
        address 	from;
        uint    	amount;
		string 		username;
		string 		message;
        uint    	date;
    }
	/***********************/

	
	/***********************
	 * Data				   
	 */
	uint			public id;
	string 			public name;
	string 			public description;
	uint256  		public total;
	uint 			public startDate;
	uint 			public endDate;
	uint256 		public goal;
	Contribution[] 	public contributions;
	address			public recipient;
	bool 			public ended;
	/***********************/
	
	
	
	/***********************
	 * Modifier	   
	 */
	modifier isActive {
		if (ended == false) {
			_
	
	modifier isEnded {
		if (ended == true) {
			_
		}
	}	}
	}

	modifier onlyRecipient {
		if (msg.sender == recipient) {
			_
		}
	}
	/***********************/
	
	
	/***********************
	 * Events	   
	 */
	
	/***********************/
	event Contribute(address from, string username, string message, uint256 amount);
	event Withdraw(address to, uint256 amount);
	
	/***********************
	 * Constructor	   
	 */
	function PotChain(uint _endDate, uint256 _goal) {
		if(_endDate <= 0) {
			throw;
		}
		if(_goal <=0) {
			throw;
		}
		
		startDate 	= now;
		endDate 	= _endDate;
		goal 		= _goal;
	}
	/***********************/
	
	
	/***********************
	 * Functions	   
	 */
	function contribute(string _username, string _message) isActive returns (bool _success) {
		Contribution memory contribution;
		
		contribution.from 			= msg.sender;
		contribution.amount 		= msg.value;
		contribution.date 			= now; 
		contribution.username 		= _username;
		contribution.message 		= _message;
		
		Contribute(msg.sender, _username, _message, msg.value);
		
		return true;
	}
	
	function withdraw() isEnded returns (bool _success)  {
	
		Withdraw(msg.sender, total);
		
		return true;
	}
	/***********************
	
	
	/***********************
	 * Events	   
	 */
	
	/***********************/
	
}
