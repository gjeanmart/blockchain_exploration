contract HelloWorld {	
	// *********************************************
	// * Struct 
    struct Message {
        address sender;
        string  message;
        uint    date;
    }

	
	// *********************************************
	// * Data 
	address owner;
	Message public lastMessage;
	
	
	// *********************************************
	// * Modifier
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }
	
	// *********************************************
	// * Constructor 
	// @description
	function HelloWorld() {
		owner = msg.sender;
	}
	
	// *********************************************
	// * setMessage 
	// @description
	function setMessage(string _message) {
		lastMessage.sender = msg.sender;
		lastMessage.message = _message;
		lastMessage.date = now; 
	}
	
	// *********************************************
	// * getMessage 
	// @description
	function getLastMessage() returns (address, string, uint) {
		return (lastMessage.sender, lastMessage.message, lastMessage.date);
	}
	
	// *********************************************
	// * kill 
	// @description: Function to recover the funds on the contract
    function kill() onlyOwner { 
        selfdestruct(owner); 
    }

}