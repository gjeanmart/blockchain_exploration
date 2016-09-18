'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-details-controller.js
     ******************************************/
    angular.module('PotChain').controller('potDetailsController', potDetailsController);
    
    potDetailsController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$stateParams', 'init', 'PotRegistryContractService'];

    function potDetailsController ($scope, $rootScope, $log, $state, $stateParams, init, PotRegistryContractService) {
	
        $scope.initialize = function() {
            $log.debug("[pot-details-controller.js - initialize()] (START) controller 'potDetailsController'");
        
            init.then(function(account) {
                $log.debug("[pot-details-controller.js - initialize()] (DEBUG) account="+account.address);
			
				$scope.address = $stateParams.address;
			});
        };


        // INIT
        $scope.initialize();
    }
    
})();