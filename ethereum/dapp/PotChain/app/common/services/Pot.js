'use strict';
(function(){
    
    /******************************************
     **** common/service/Pot.js
     ******************************************/
    angular.module('PotChain').service('PotContractService', PotContractService);
	
    PotContractService.$inject  = ['$log', '$q', '$filter'];

    function PotContractService ($log, $q, $filter) {
		var service = this;
		
		service.getContract = function(contractAddress) {
			return contract = Pot.at(contractAddress);
		};
		
		service.getPot	 = function(contractAddress, senderAddress) {
			$log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")] (START)");
			
			return $q(function(resolve, reject) 	{
				service.getContract(contractAddress).getDetails.call({from: senderAddress}).then(function(result) {
					$log.debug(result);
					
					if(result[0] === "0x") {
						reject("Pot does not exist");
					}
					
					var pot = {
						owner		: result[0],
						name		: web3.toAscii(result[1]),
						description	: web3.toAscii(result[2]),
						total		: result[3].toNumber(),
						startDate	: new Date(result[4].toNumber() * 1000),
						endDate		: new Date(result[5].toNumber() * 1000),
						goal		: result[6].toNumber(),
						recipient	: result[7],
						endded		: result[8]
					};
					
					$log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")] (END) name = " + pot.name);
					
					resolve(pot);
					
				}, function(error) {
					$log.error($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")] (ERROR) error="+error);
					reject(error);
				});
			});
		};
		
		service.sendMessage	 = function(contractAddress, username, message, senderAddress) {
			$log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / sendMessage(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+")] (START)");
		
			return $q(function(resolve, reject) 	{
				service.getContract(contractAddress).sendMessage(username, message, {from: senderAddress}).then(function(transaction) {
					$log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / sendMessage(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+")] (END) transaction="+transaction);
					resolve(transaction);
					
				}, function(error) {
					$log.error($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / sendMessage(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+")] (ERROR) error="+error);
					reject(error);
				});
			});

		};
		
		service.getMessages = function (contractAddress, pageNo, pageSize, senderAddress) {
			$log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / getMessages(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")] (START)");
			
			return $q(function(resolve, reject) 	{
				service.getContract(contractAddress).getMessages.call(pageNo, pageSize, {from: senderAddress}).then(function(result) {
					$log.debug(result);
					
					var messages = [];
					
					for(var i = 0; i < result[0].length; i++) {
						var message = {
							sender		: result[2][i],
							username	: web3.toAscii(result[1][i]),
							text		: web3.toAscii(result[0][i]),
							date		: new Date(result[3][i].toNumber() * 1000)
						};
						messages.push(message);
					}
					
					$log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / getMessages(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")]  (END) nb result=" + messages.length);
					resolve({
						data : messages,
						total: result[4].toNumber()
					});
					
				}, function(error) {
					$log.error($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " [Pot.js / getMessages(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")] (ERROR) error="+error);
					reject(error);
				});
			});
		};
		
    }
	
})();