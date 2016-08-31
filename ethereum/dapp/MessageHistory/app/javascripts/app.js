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

  c.getLastMessage.call({from: account}).then(function(sender, text, date) {
    var lastMessage_element = document.getElementById("lastMessage");
    lastMessage_element.innerHTML = text;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting last message; see log.");
  });
};

function send() {
  var c = MessageHistory.deployed();

  var message = document.getElementById("message").value;

  setStatus("Initiating transaction... (please wait)");

  meta.sendMessage(message, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending msg; see log.");
  });
};

window.onload = function() {
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
    getLastMessage();
  });
}
