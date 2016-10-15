'use strict';
(function(){
    
    /******************************************
     **** common/service/PotRegistry.js
     ******************************************/
    angular.module('PotChain').service('PotRegistryContractService', PotRegistryContractService);
    
    PotRegistryContractService.$inject  = ['$rootScope', '$log', '$q','commonService'];

    function PotRegistryContractService ($rootScope, $log, $q, commonService) {
        var service = this;

        service.contract = PotRegistry.deployed();
    
        service.createPot = function (address, name, description, endDate, goal, recipient) {
            commonService.log.debug("PotRegistry.js", "createPot(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+", recipient="+recipient+")", "START");
			
            return $q(function(resolve, reject)     {
                service.contract.createPot(name, description, endDate / 1000, web3.toWei(goal, "ether"), recipient, {from: address}).then(function(transaction) {
                    commonService.log.debug("PotRegistry.js", "createPot(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+", recipient="+recipient+")", "END", "transaction="+transaction);
                    
                    resolve(transaction);
                }, function(error) {
                    commonService.log.error("PotRegistry.js", "createPot(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+", recipient="+recipient+")", "END", "error="+error);
                    reject(error);
                });
            });
        };
		
		service.createPot.estimate = function (address, name, description, endDate, goal, recipient) {
            commonService.log.debug("PotRegistry.js", "createPot.estimate(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+", recipient="+recipient+")", "START");
	
            return $q(function(resolve, reject)     {
				service.contract.createPot.estimateGas(name, description, endDate / 1000, web3.toWei(goal, "ether"), recipient, {from: address}).then(function(result) {
					var gasEstimation = $rootScope.gasPrice * Number(result);
					
					commonService.log.debug("PotRegistry.js", "createPot.estimate(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+", recipient="+recipient+")", "END", "estimateGas="+gasEstimation);

                    resolve(gasEstimation);
					
				}, function(error) {
					commonService.log.error("PotRegistry.js", "createPot.estimate(address="+address+", name="+name+", description="+description+", endDate="+endDate+", goal="+goal+", recipient="+recipient+")", "END", "error="+error);
                    reject(error);
				});
            });
        };
    
        service.getPots = function (address, pageNo, pageSize) {
            commonService.log.debug("PotRegistry.js", "getPots(address="+address+", pageNo="+pageNo+", pageSize="+pageSize+")", "START");
            
            return $q(function(resolve, reject)     {
                service.contract.getPots.call(pageNo, pageSize, {from: address}).then(function(result) {
                    $log.debug(result);
                    
                    var pots = [];
                    
                    for(var i = 0; i < result[0].length; i++) {
                        var pot = {
                            address     : result[0][i],
                            name        : web3.toAscii(result[1][i]),
                            description : web3.toAscii(result[2][i])
                        };
                        pots.push(pot);
                    }
                    
                    commonService.log.debug("PotRegistry.js", "getPots(address="+address+", pageNo="+pageNo+", pageSize="+pageSize+")", "END", "nb result=" + pots.length);
                    resolve({
                        data : pots,
                        total: result[3].toNumber()
                    });
                    
                }, function(error) {
                    commonService.log.error("PotRegistry.js", "getPots(address="+address+", pageNo="+pageNo+", pageSize="+pageSize+")", "END", "error="+error);
                    reject(error);
                });
            });
        };
        
    }
    
})();