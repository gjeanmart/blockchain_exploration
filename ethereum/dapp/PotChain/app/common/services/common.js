'use strict';
(function(){
    
    /******************************************
     **** common/service/common.js
     ******************************************/
    angular.module('PotChain').service('commonService', commonService);
	
    commonService.$inject  = [];

    function commonService () {
		var service = this;
		
		service.sayHello = function() {
			return "Hello, World!"
		};
		
    }
	
})();