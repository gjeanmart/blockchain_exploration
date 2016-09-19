'use strict';
(function(){
    
    /******************************************
     **** common/service/PotRegistry.js
     ******************************************/
    angular.module('PotChain').service('PotRegistryContractService', PotRegistryContractService);
	
    PotRegistryContractService.$inject  = ['$log', '$q'];

    function PotRegistryContractService ($log, $q) {
		var service = this;
    
        service.contract = PotRegistry.deployed();
	
		service.createPot = function (address, name, description, endDate, goal) {
			$log.debug("[PotRegistry.js / createPot(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+")] (START)");
			
			return $q(function(resolve, reject) 	{
				var x = service.contract.createPot(name, description, endDate / 1000, goal, {from: address}).then(function(transaction) {
					$log.debug("[PotRegistry.js / createPot(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+")] (END) transaction="+transaction);
					resolve(transaction);
				}, function(error) {
					$log.error("[PotRegistry.js / createPot(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+")] (ERROR) error="+error);
					reject(error);
				});
				console.log(x);
			});
		};
	
		service.getPots = function (address, pageNo, pageSize) {
			$log.debug("[PotRegistry.js / getPots(address="+address+", pageNo="+pageNo+", pageSize="+pageSize+")] (START)");
			
			return $q(function(resolve, reject) 	{
				service.contract.getPots.call(pageNo, pageSize, {from: address}).then(function(result) {
					$log.debug(result);
					
					var pots = [];
					
					for(var i = 0; i < result[0].length; i++) {
						var pot = {
							address		: result[0][i],
							name		: web3.toAscii(result[1][i]),
							description	: web3.toAscii(result[2][i])
						};
						pots.push(pot);
					}
					
					$log.debug("[PotRegistry.js / getPots(address="+address+", pageNo="+pageNo+", pageSize="+pageSize+")] (END) nb result=" + pots.length);
					resolve({
						data : pots,
						total: result[3].toNumber()
					});
					
				}, function(error) {
					$log.error("[PotRegistry.js / getPots(address="+address+", pageNo="+pageNo+", pageSize="+pageSize+")] (ERROR) error="+error);
					reject(error);
				});
			});
		};
		
    }
	
})();