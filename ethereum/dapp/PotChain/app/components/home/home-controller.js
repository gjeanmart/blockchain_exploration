'use strict';
(function(){
    
    /******************************************
     **** components/home/home-controller.js
     ******************************************/
    angular.module('PotChain').controller('homeController', homeController);
	
    homeController.$inject  = ['$scope', '$rootScope', '$log', '$state', 'init'];

    function homeController ($rootScope, $scope, $log, $state, init) {

        $scope.initialize = function() {
			$log.debug("[home-controller.js - initialize()] (START) controller 'homeController'");
        
			init.then(function(accounts) {
				$log.debug("[home-controller.js - initialize()] (DEBUG) accounts="+accounts);
			});
		};

        
        

        // INIT
        $scope.initialize();
    }
	
})();