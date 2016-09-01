contract MessageHistory {	

	// *********************************************
	// * Struct 
    	struct Message {
        	address sender;
        	bytes32  text;
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
	function sendMessage(bytes32 _text) returns (bool sucess) {
		Message memory msg;
		
		msg.sender 	= msg.sender;
		msg.text 	= _text;
		msg.date 	= now; 

		messageHistory.push(msg);
		
		return true;
	}
	
	// *********************************************
	// * getSize
	// @description
	function getSize() returns (uint) {
		return (messageHistory.length);
	}
	
	// *********************************************
	// * getLastMessage 
	// @description
	function getLastMessage() returns (bytes32) {
		if(messageHistory.length == 0) {
			throw;
		}
		uint i = messageHistory.length - 1;

		return (messageHistory[i].text);
	}
	
	// *********************************************
	// * getLastMessage 
	// @description
	function getMessages() constant returns (bytes32[]) {
		if(messageHistory.length == 0) {
			throw;
		} 
		
		uint length = messageHistory.length;
		bytes32[] memory messages = new bytes32[](length);

		for (var i = 0; i < messageHistory.length; i++) { 
			messages[i] = messageHistory[i].text;
		}
		
		return messages;
	}

	// *********************************************
	// * kill 
	// @description: Function to recover the funds on the contract
    	function kill() onlyOwner { 
        	selfdestruct(owner); 
    	}

}
