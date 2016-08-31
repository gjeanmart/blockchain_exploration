contract MessageHistory {	

	// *********************************************
	// * Struct 
    	struct Message {
        	address sender;
        	string  text;
        	uint    date;
    	}

	
	// *********************************************
	// * Data 
	address public owner;
	Message[] public messageHistory;
	
	// *********************************************
	// * Modifier
    	modifier onlyOwner {
        	if (msg.sender != owner) throw;
        	_
    	}
	
	// *********************************************
	// * Constructor 
	// @description
	function MessageHistory() {
		owner 		= msg.sender;
	}
	
	// *********************************************
	// * sendMessage 
	// @description
	function sendMessage(string _text) returns (bool sucess) {
		Message memory msg;
		
		msg.sender 	= msg.sender;
		msg.text 	= _text;
		msg.date 	= now; 

		messageHistory.push(msg);
		
		return true;
	}
	
	// *********************************************
	// * getLastMessage 
	// @description
	function getLastMessage() returns (address, string, uint) {
		if(messageHistory.length == 0) {
			throw;
		}
		uint256 i = messageHistory.length - 1;

		return (messageHistory[i].sender, messageHistory[i].text, messageHistory[i].date);
	}

	// *********************************************
	// * kill 
	// @description: Function to recover the funds on the contract
    	function kill() onlyOwner { 
        	selfdestruct(owner); 
    	}

}
