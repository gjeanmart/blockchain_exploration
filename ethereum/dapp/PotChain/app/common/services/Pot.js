'use strict';
(function(){
    
    /******************************************
     **** common/service/Pot.js
     ******************************************/
    angular.module('PotChain').service('PotContractService', PotContractService);
	
    PotContractService.$inject  = [];

    function PotContractService () {
		var service = this;
		
		service.sayHello = function() {
			return "Hello, World!"
		};
		
    }
	
})();