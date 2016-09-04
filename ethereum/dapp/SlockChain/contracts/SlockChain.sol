import "Utils.sol";

contract SlockChain {	

	// *********************************************
	// * Struct 
    	struct Message {
        	address 	sender;
        	bytes32  	text;
        	uint    	date;
    	}

	
	// *********************************************
	// * Data 
	address 					public owner;
	mapping(uint => Message[]) 	public channels;
	mapping(uint => bytes32) 	public channelsName;
	uint 						public nbChannel;
	
	// *********************************************
	// * Events 
	// level : 0 ERROR, 1 INFO, 2 WARNING, 3 DEBUG, 4 TRACE
	event Log(uint level, 
			  bytes32 title,
			  bytes32 text, 
			  uint date
	);
	
	// *********************************************
	// * Modifier
    	modifier onlyOwner {
        	if (msg.sender != owner) {
				Log(0, "Error", "Restricted function", now);
				throw;
        	}
			_
    	}
	
	// *********************************************
	// * Constructor 
	// @description
	function SlockChain() {
		owner 		= msg.sender;
		nbChannel   = 0;
	}
	
	// *********************************************
	// * sendMessage 
	// @description
	function sendMessage(uint channelID, bytes32 _text) returns (bool sucess) {
		if(channelID >= nbChannel) {
			Log(0, "Error", "Channel does not exist", now);
			throw;
		}
	
		Message memory message;
		
		message.sender 	= msg.sender;
		message.text 	= _text;
		message.date 	= now; 
		
		channels[channelID].push(message);
		
		Log(1, "New message", _text, now);
		
		return true;
	}
	
	// *********************************************
	// * getLastMessage 
	// @description
	function getLastMessage(uint channelID) returns (bytes32, address, uint) {
		if(channelID >= nbChannel) {
			Log(0, "Error", "Channel does not exist", now);
			throw;
		}
		
		uint length = channels[channelID].length;
		
		return (channels[channelID][length-1].text, channels[channelID][length-1].sender, channels[channelID][length-1].date);
	}
	
	
	// *********************************************
	// * getMessages 
	// @description
	// @TODO: pagination
	function getMessages(uint channelID) constant returns (bytes32[], address[], uint[]) {
		if(channelID >= nbChannel) {
			Log(0, "Error", "Channel does not exist", now);
			throw;
		}
	
		uint length = channels[channelID].length;
		
		bytes32[] 	memory messagesText 	= new bytes32[](length);
		uint[] 		memory messagesDate 	= new uint[](length);
		address[] 	memory messagesAddress 	= new address[](length);

		for (var i = 0; i < length; i++) { 
			Message memory message = channels[channelID][i];
		
			messagesText[i] 	= message.text;
			messagesAddress[i] 	= message.sender;
			messagesDate[i] 	= message.date;
		}
		
		return (messagesText, messagesAddress, messagesDate);
	}
	
	// *********************************************
	// * getChannels
	// @description
	function getChannels() constant returns (uint[], bytes32[]) {
		bytes32[] 	memory names 	= new bytes32[](nbChannel);
		uint[] 		memory ids		= new uint[](nbChannel);

		for (var i = 0; i < nbChannel; i++) { 
			names[i] = channelsName[i];
			ids[i] 	 = i;
		}
		
		return (ids, names);
	}
	
	// *********************************************
	// * createChannel
	// @description
	function createChannel(bytes32 name) returns (uint channelID) {
		channelsName[nbChannel] = name;
		
		nbChannel += 1;
		
		Log(1, "New channel", name, now);
		
		return nbChannel;
	}
	

	// *********************************************
	// * kill 
	// @description: Function to recover the funds on the contract
    function kill() onlyOwner { 
        selfdestruct(owner); 
    }
	

}
