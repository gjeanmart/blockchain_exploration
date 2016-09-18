'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-list-controller.js
     ******************************************/
    angular.module('PotChain').controller('potListController', potListController);
    
    potListController.$inject  = ['$scope', '$rootScope', '$log', '$state', 'NgTableParams', 'init', 'PotRegistryContractService'];

    function potListController ($scope, $rootScope, $log, $state, NgTableParams, init, PotRegistryContractService) {
	
        $scope.initialize = function() {
            $log.debug("[pot-list-controller.js - initialize()] (START) controller 'potListController'");
        
            init.then(function(account) {
                $log.debug("[pot-list-controller.js - initialize()] (DEBUG) account="+account.address);
            
				$scope.load();
			});
        };

        $scope.load = function() {
			$scope.table = new NgTableParams({
				page	: 1,
				count	: $rootScope.PAGE_SIZE_DEFAULT
			}, {
				total: 0,
				getData: function(params) { 
					return PotRegistryContractService.getPots($rootScope.account.address, params.page(), params.count()).then(function (result) {
					   $log.debug(result);
					   $log.debug("[pot-list-controller.js - load()] (END)");
			
						params.total(result.total);
						console.log(result.data);
						return result.data;

					}, function (error) {
						$log.debug("[pot-list-controller.js - load()] (ERROR) error="+error);
					});
				}
			});	
		};
		
        $scope.reload = function() {
			$scope.table.reload();
		};
		
		
        // INIT
        $scope.initialize();
    }
    
})();