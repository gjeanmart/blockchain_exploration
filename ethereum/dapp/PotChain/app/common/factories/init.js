'use strict';
(function(){
    
    /******************************************
     **** common/factories/init.js
     ******************************************/
    angular.module('PotChain').factory('init', init);
	
    init.$inject  = ['$log', '$q', '$state', 'RPC_URL', '$rootScope', 'ethereumService'];

    function init ($log, $q, $state, RPC_URL, $rootScope, ethereumService) {
		
		return $q(function(resolve, reject) {
			$log.debug("[init.js / init()] (START)");
			
			// Get WEB3
			if(typeof web3 !== 'undefined') {
				web3 = new Web3(web3.currentProvider);  
			} else {
				web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
			}

			// Get network Info
			ethereumService.getNetwork().then(function(network){
				$log.debug("[init.js / init()] (DEBUG) network=" + network.id);
			
				$rootScope.network = network;
				
			}, function(error) {
				$log.error("[init.js / init()] (ERROR) network/error " + error);
				
				$state.go('error', {
					error : {
						code		: 1,
						message		: error
					}
				});
				
				reject(error);
			});
			
			// Get addresses
			ethereumService.getAddresses().then(function(addresses) {
				$log.debug("[init.js / init()] (DEBUG) getAddresses=" + addresses);
			
				$rootScope.addresses = addresses;
				
				resolve(addresses)
				
			}, function(error) {
				$log.error("[init.js / init()] (ERROR) getAddresses/error " + error);
				
				reject(error);
			});
		});
		
    }
	
})();