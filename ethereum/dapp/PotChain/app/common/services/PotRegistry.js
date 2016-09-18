'use strict';
(function(){
    
    /******************************************
     **** common/service/PotRegistry.js
     ******************************************/
    angular.module('PotChain').service('PotRegistryContractService', PotRegistryContractService);
	
    PotRegistryContractService.$inject  = [];

    function PotRegistryContractService () {
		var service = this;
    
		service.sayHello = function() {
			return "Hello, World!"
		};
		
    }
	
})();