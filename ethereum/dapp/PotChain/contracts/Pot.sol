import './Killable.sol';

/**
 * Pot
 */
contract Pot is Killable {

	/***********************
	 * Structure and enums	   
	 */
    struct Contribution {
        address 	from;
        uint    	amount;
		bytes32 	username;
		bytes32 	message;
        uint    	date;
    }
    struct Message {
        address 	from;
        bytes32  	text;
		bytes32 	username;
        uint    	date;
    }
	/***********************/

	
	/***********************
	 * Data				   
	 */
	address			public owner;
	bytes32 		public name;
	bytes32 		public description;
	uint256  		public total;
	uint 			public startDate;
	uint 			public endDate;
	uint256 		public goal;
	Contribution[] 	public contributions;
	Message[] 		public messages;
	address			public recipient;
	bool 			public ended;
	/***********************/
	
	
	
	/***********************
	 * Modifier	   
	 */
	modifier isActive {
		if(endDate > now && ended == false) {
			_
		}
	}
	modifier isEnded {
		if (endDate <= now || ended == true) {
			_
		}
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
	event Contribute(address from, bytes32 username, bytes32 message, uint256 amount);
	event Withdraw(address to, uint256 amount);
	/***********************/

	/***********************
	 * Constructor	   
	 */
	function Pot(address _owner, bytes32 _name, bytes32 _description, uint _endDate, uint256 _goal) {
		//TODO check if name and description are not null
		
		if(_endDate <= 0) {
			throw;
		}
		if(_goal <=0) {
			throw;
		}
		
		owner			= _owner;
		name 			= _name;
		description 	= _description;
		startDate 		= now;
		endDate 		= _endDate;
		goal 			= _goal;
	}
	/***********************/
	
	
	/***********************
	 * Functions	   
	 */
	function getDetails() constant returns (address _owner, bytes32 _name, bytes32 _description, uint256 _total, uint _startDate, uint _endDate, uint256 _goal, address _recipient, bool _ended) {
		return (owner, name, description, total, startDate, endDate, goal, recipient, ended);
	}
	
	function getContributions() constant returns (address[] _from, uint[] _amount, bytes32[] _username, bytes32[] _message, uint[] date) {
	
		uint length = contributions.length;
		
		address[] 	memory contributionAddressArray 	= new address[](length);
		uint[] 		memory contributionAmountArray 		= new uint[](length);
		bytes32[] 	memory contributionUsernameArray 	= new bytes32[](length);
		bytes32[] 	memory contributionMessageArray		= new bytes32[](length);
		uint[] 		memory contributionDateArray		= new uint[](length);

		for (var i = 0; i < length; i++) { 
			Contribution memory contribution = contributions[i];
		
			contributionAddressArray[i] = contribution.from;
			contributionAmountArray[i] 	= contribution.amount;
			contributionUsernameArray[i]= contribution.username;
			contributionMessageArray[i] = contribution.message;
			contributionDateArray[i] 	= contribution.date;
		}
		
		return (contributionAddressArray, contributionAmountArray, contributionUsernameArray, contributionMessageArray, contributionDateArray);	
	}
	
	function getMessages() constant returns (bytes32[], bytes32[], address[], uint[]) {
		uint length = messages.length;
		
		address[] 	memory messagesAddressArray 	= new address[](length);
		bytes32[] 	memory messagesTextArray 		= new bytes32[](length);
		bytes32[] 	memory messagesUsernameArray	= new bytes32[](length);
		uint[] 		memory messagesDateArray 		= new uint[](length);

		for (var i = 0; i < length; i++) { 
			Message memory message = messages[i];
		
			messagesAddressArray[i] 	= message.from;
			messagesTextArray[i] 		= message.text;
			messagesUsernameArray[i] 	= message.username;
			messagesDateArray[i] 		= message.date;
		}
		
		return (messagesTextArray, messagesUsernameArray, messagesAddressArray, messagesDateArray);
	}

	 
	function contribute(bytes32 _username, bytes32 _message) isActive returns (bool) {
		Contribution memory contribution;
		
		contribution.from 			= msg.sender;
		contribution.amount 		= msg.value;
		contribution.date 			= now; 
		contribution.username 		= _username;
		contribution.message 		= _message;
		
		total += msg.value;
		
		Contribute(msg.sender, _username, _message, msg.value);
		
		return true;
	}
	
	function withdraw() isEnded onlyRecipient returns (bool)  {
	
		if (!recipient.send(total)) {
			// TODO LOG ERROR
			throw;
        }
	
		Withdraw(msg.sender, total);
		
		total = 0;
		
		return true;
	}
	
	function endPot() onlyOwner returns (bool)  {
		ended = true;

		return true;
	}
	/***********************/
	
	
}