'use strict';
(function(){
    
    /******************************************
     **** common/service/ethereum.js
     ******************************************/
    angular.module('PotChain').service('ethereumService', ethereumService);
	
    ethereumService.$inject  = ['$log', '$q', '$filter', 'NETWORKS'];

    function ethereumService ($log, $q, $filter, NETWORKS) {
		var service = this;
		
		/**
		 * getAddresses
		 */
		service.getAddresses = function () {
			$log.debug("[ethereum.js / getAddresses()] (START)");
			
			return $q(function(resolve, reject) 	{
				web3.eth.getAccounts(function(err, accs) {
					if (err != null) {
						$log.error("[ethereum.js / getAddresses()] (ERROR) There was an error fetching your accounts : " + err);
						reject("There was an error fetching your accounts : " + err);
					}

					if (accs.length == 0) {
						$log.error("[ethereum.js / getAddresses()] (ERROR) Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
						reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
					}
					
					$log.debug("[ethereum.js / getAddresses()] (END) : number of accounts fetched = " + accs.length);

					resolve(accs);
					
				}, function(error) {
					$log.error("[ethereum.js / getAddresses()] (ERROR) error="+error);
					reject(error);
				});
			});
		};
		
		service.getBalance = function (address) {
			$log.debug("[ethereum.js / getBalance(address="+address+")] (START)");
			
			return $q(function(resolve, reject) 	{

				web3.eth.getBalance(address, 'latest', function(err, result) {
					$log.error("[ethereum.js / getBalance(address="+address+")] (ERROR) error="+err);
					reject(err);
					
				}, function(err, result) {
					if (err != null) {
						$log.error("[ethereum.js / getBalance(address="+address+")] (ERROR) There was an error sending a transaction : " + err);
						reject("There was an error fetching sending your transaction : " + err);
					}
							
					var balance = Number(web3.fromWei(result, "ether"));
					$log.debug("[ethereum.js / getBalance(address="+address+")] (END) balance="+balance);
					
					resolve(balance);
				});
			});
		};
		
		service.sendTransaction = function (address, receiver, amount) {
			$log.debug("[ethereum.js / getBalance(address="+address+", receiver="+receiver+", amount="+amount+")] (START)");
			
			return $q(function(resolve, reject) 	{
				
				web3.eth.sendTransaction({from: address, to: receiver, value: web3.toWei(amount, "ether")}, function(error) {
					$log.error("[ethereum.js / getBalance(address="+address+", receiver="+receiver+", amount="+amount+")] (ERROR): error=" + error);
					reject(error);
					
				}, function(err, tx) {
					if (err != null) {
						$log.error("[ethereum.js / getBalance(address="+address+", receiver="+receiver+", amount="+amount+")] (ERROR): There was an error fetching sending your transaction : " + err);
						reject("There was an error fetching sending your transaction : " + err);
					}
							
					$log.debug("[ethereum.js / getBalance(address="+address+", receiver="+receiver+", amount="+amount+")] (END) transaction=" + tx);
					
					resolve(tx);
				});
				
			});
		};
		
		service.getNetwork = function () {
			$log.debug("[ethereum.js / getNetwork()] (START)");
			
			return $q(function(resolve, reject) 	{
				
				web3.version.getNetwork(function(err, result) {
					if (err != null) {
						$log.error("[ethereum.js / getNetwork()] (ERROR) There was an error sending a transaction : " + err);
						reject("There was an error fetching sending your transaction : " + err);
					}
					
					var networkInfo = {
						'id' 			: result,
						'name' 			: ($filter('filter')(NETWORKS, {id: result})[0] === undefined) ? result : $filter('filter')(NETWORKS, {id: result})[0].name
						//'api' 			: web3.version.api,
						//'ethereum' 		: web3.version.ethereum,
						//'node' 			: web3.version.node,
						//'isConnected' 	: web3.isConnected()
					};

					$log.debug("[ethereum.js / getNetwork()] (END) result=" + result);
					resolve(networkInfo);
					
				}, function(error) {
					$log.error("[ethereum.js / getNetwork()] (ERROR) " + error);
					reject(error);
				});
				
			});
			
		};
    }
	
})();