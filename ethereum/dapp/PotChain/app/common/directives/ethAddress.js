'use strict';
(function() {
    

	    
    /******************************************
     **** common/directives/ethAddress.js
     ******************************************/
    angular.module('PotChain').directive('ethAddress', ['ethereumService', function (ethereumService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, ele, attrs, ctrl){
				ctrl.$parsers.unshift(function(value) {
					var valid = ethereumService.validateAddress(value);
					if(value){
						ctrl.$setValidity('invalidAiportCode', valid);
					}

					return valid ? value : undefined;
				});
			}
          }
	}]);  
})();