var accounts;
var account;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function setAddress(address) {
    var address_element = document.getElementById("address");
    address_element.innerHTML = address;
};

function getLastMessage() {
  var c = MessageHistory.deployed();
  
  console.log(c);

  c.getLastMessage.call({from: account}).then(function(result) {
	  console.log(result);

	  
    var lastMessage_element = document.getElementById("lastMessage");
    lastMessage_element.innerHTML = result[1];
	
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting last message; see log.");
  });
};

function sendMessage() {
  var c = MessageHistory.deployed();
  
  console.log(c);

  var message = document.getElementById("message").value;
  c.sendMessage(message, {from: account}).then(function(result) {
    setStatus("Transaction complete!");
    getLastMessage();
	getBalance(account);
	
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting last message; see log.");
  });
};

function getBalance(account) {

	var balance =  web3.fromWei(web3.eth.getBalance(account), "ether");
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = balance;

};

window.onload = function() {
	web3.setProvider(new web3.providers.HttpProvider('http://192.158.29.106:8545'));


	
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

	console.log(account);
	
    setAddress(account);
	getBalance(account);
    getLastMessage();
  });
}
