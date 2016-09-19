'use strict';
(function(){
    
    /******************************************
     **** common/service/Pot.js
     ******************************************/
    angular.module('PotChain').service('PotContractService', PotContractService);
	
    PotContractService.$inject  = ['$log', '$q'];

    function PotContractService ($log, $q) {
		var service = this;
		
		service.getContract = function(contractAddress) {
			return contract = Pot.at(contractAddress);
		};
		
		service.getPot	 = function(contractAddress, senderAddress) {
			$log.debug("[Pot.js / getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")] (START)");
			
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
					
					$log.debug("[Pot.js / getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")] (END) name = " + pot.name);
					
					resolve(pot);
					
				}, function(error) {
					$log.error("[Pot.js / getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")] (ERROR) error="+error);
					reject(error);
				});
			});
		};
		
    }
	
})();