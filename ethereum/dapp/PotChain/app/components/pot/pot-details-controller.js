'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-details-controller.js
     ******************************************/
    angular.module('PotChain').controller('potDetailsController', potDetailsController);
    
    potDetailsController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$stateParams', 'init', 'PotContractService'];

    function potDetailsController ($scope, $rootScope, $log, $state, $stateParams, init, PotContractService) {
	
        $scope.initialize = function() {
            $log.debug("[pot-details-controller.js - initialize()] (START) controller 'potDetailsController'");
        
            init.then(function(account) {
                $log.debug("[pot-details-controller.js - initialize()] (DEBUG) account="+account.address);
			
				$scope.address = $stateParams.address;
				
				$scope.getDetails();
			});
        };
		
		$scope.getDetails = function() {
			$log.debug("[pot-details-controller.js - getDetails()] (START)");
			
			PotContractService.getPot($scope.address).then(function (result) {
				$scope.pot = result;
				
				$log.debug("[pot-details-controller.js - getDetails()] (END) name="+$scope.pot.name);
				
			}, function (error) {
				$log.error("[pot-details-controller.js - getDetails()] (ERROR) error="+error);
			});
		};


        // INIT
        $scope.initialize();
    }
    
})();