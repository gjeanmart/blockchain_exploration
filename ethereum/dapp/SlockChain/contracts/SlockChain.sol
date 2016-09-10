import "Utils.sol";

contract SlockChain {	

	// *********************************************
	// * Struct 
    	struct Message {
        	address 	sender;
			bytes32		username;
        	bytes32  	text;
        	uint    	date;
    	}
    	struct Account {
			bool 		active;
        	bytes32 	username;
        	bytes32  	email;
    	}


	
	// *********************************************
	// * Data 
	address 						public owner;
	mapping(address => Account) 	public accounts;
	mapping(uint 	=> Message[]) 	public channels;
	mapping(uint 	=> bytes32) 	public channelsName;
	uint 							public nbChannel;
	
	// *********************************************
	// * Events 
	// level : 0 ERROR, 1 INFO, 2 WARNING, 3 DEBUG, 4 TRACE
	event Log(uint 		level, 
			  bytes32 	title,
			  bytes32 	text, 
			  uint 		date,
			  address 	sender
	);
	
	// *********************************************
	// * Modifier
    	modifier onlyOwner {
        	if (msg.sender != owner) {
				Log(0, "Error", "Restricted function", now, msg.sender);
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
	function sendMessage(uint _channelID, bytes32 _text, bytes32 _username) returns (bool sucess) {
		if(_channelID >= nbChannel) {
			Log(0, "Error", "Channel does not exist", now, msg.sender);
			throw;
		}
	
		Message memory message;
		
		message.sender 			= msg.sender;
		message.text 			= _text;
		message.date 			= now; 
		message.username 		= _username;
		
		channels[_channelID].push(message);
		
		Log(1, "New message", _text, now, msg.sender);
		
		return true;
	}
	
	// *********************************************
	// * getLastMessage 
	// @description
	function getLastMessage(uint _channelID) returns (bytes32, bytes32, address, uint) {
		if(_channelID >= nbChannel) {
			Log(0, "Error", "Channel does not exist", now, msg.sender);
			throw;
		}
		
		uint length = channels[_channelID].length;
		
		return (channels[_channelID][length-1].text, channels[_channelID][length-1].username, channels[_channelID][length-1].sender, channels[_channelID][length-1].date);
	}
	
	
	// *********************************************
	// * getMessages 
	// @description
	// @TODO: pagination
	function getMessages(uint _channelID) constant returns (bytes32[], bytes32[], address[], uint[]) {
		if(_channelID >= nbChannel) {
			Log(0, "Error", "Channel does not exist", now, msg.sender);
			throw;
		}
	
		uint length = channels[_channelID].length;
		
		bytes32[] 	memory messagesText 	= new bytes32[](length);
		uint[] 		memory messagesDate 	= new uint[](length);
		address[] 	memory messagesAddress 	= new address[](length);
		bytes32[] 	memory messagesUsername	= new bytes32[](length);

		for (var i = 0; i < length; i++) { 
			Message memory message = channels[_channelID][i];
		
			messagesText[i] 	= message.text;
			messagesAddress[i] 	= message.sender;
			messagesDate[i] 	= message.date;
			messagesUsername[i] = message.username;
		}
		
		return (messagesText, messagesUsername, messagesAddress, messagesDate);
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
	function createChannel(bytes32 _name) returns (uint) {
		channelsName[nbChannel] = _name;
		
		nbChannel += 1;
		
		Log(1, "New channel", _name, now, msg.sender);
		
		return nbChannel;
	}
	
	// *********************************************
	// * createAccount
	// @description
	function createAccount(bytes32 _email, bytes32 _username) returns (bool) {
		Account memory account;
		
		account.username 	= _username;
		account.email 		= _email;
		account.active 		= true;
		
		accounts[msg.sender] = account;
		
		Log(1, "New account", _email, now, msg.sender);
		
		return true;
	}
	
	// *********************************************
	// * getAccount
	// @description
	function getAccount(address _add) constant returns (bool, bytes32, bytes32) {
		//if (accounts[msg.sender].active == false) {
		//	return (false, 0, 0);
		//}
	
		bool active 		= accounts[_add].active;
		bytes32 username 	= accounts[_add].username;
		bytes32 email 		= accounts[_add].email;
		
		return (active, username, email);
	}
	
	// *********************************************
	// * updateAccount
	// @description
	function updateAccount(bytes32 _email, bytes32 _username) returns (bool) {
		Account memory account;
		
		account.username 	= _username;
		account.email 		= _email;
		account.active 		= true;
		
		accounts[msg.sender] = account;
		
		Log(1, "New account", _email, now, msg.sender);
		
		return true;
	}
	
	
	// *********************************************
	// * deleteAccount
	// @description
	function deleteAccount() returns (bool) {
		//if (accounts[msg.sender].active == false) {
		//	return (false, 0, 0);
		//}
		
		accounts[msg.sender].active = false;
		accounts[msg.sender].email = bytes32(0x0);
		accounts[msg.sender].username = bytes32(0x0);
		
		return true;
	}
	
	// *********************************************
	// * kill 
	// @description: Function to recover the funds on the contract
    function kill() onlyOwner { 
        selfdestruct(owner); 
    }
	

}
