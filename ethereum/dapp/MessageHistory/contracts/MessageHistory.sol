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
	address 	public owner;
	address 	public lastAdd;
	Message[] 	public messageHistory;
	
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
		Message memory message;
		
		message.sender 	= msg.sender;
		message.text 	= _text;
		message.date 	= now; 

		lastAdd	= msg.sender;
		
		messageHistory.push(message);
		
		return true;
	}
	
	// *********************************************
	// * getLastMessage 
	// @description
	function getLastMessage() returns (bytes32, address, uint) {
		if(messageHistory.length == 0) {
			throw;
		}
		uint i = messageHistory.length - 1;

		return (messageHistory[i].text, messageHistory[i].sender, messageHistory[i].date);
	}
	
	// *********************************************
	// * getMessages 
	// @description
	function getMessages() constant returns (bytes32[], address[], uint[]) {
		if(messageHistory.length == 0) {
			throw;
		} 
		
		uint length = messageHistory.length;
		
		bytes32[] 	memory messagesText 	= new bytes32[](length);
		uint[] 		memory messagesDate 	= new uint[](length);
		address[] 	memory messagesAddress 	= new address[](length);

		for (var i = 0; i < messageHistory.length; i++) { 
			Message memory message = messageHistory[i];
		
			messagesText[i] 	= message.text;
			messagesAddress[i] 	= message.sender;
			messagesDate[i] 	= message.date;
		}
		
		return (messagesText, messagesAddress, messagesDate);
	}

	// *********************************************
	// * kill 
	// @description: Function to recover the funds on the contract
    	function kill() onlyOwner { 
        	selfdestruct(owner); 
    	}

}
