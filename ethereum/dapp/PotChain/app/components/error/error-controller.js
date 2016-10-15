'use strict';
(function(){
    
    /******************************************
     **** components/error/error-controller.js
     ******************************************/
    angular.module('PotChain').controller('errorController', errorController);
    
    errorController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$stateParams', 'init', 'commonService'];

    function errorController ($rootScope, $scope, $log, $state, $stateParams, init, commonService) {

        $scope.initialize = function() {
            commonService.log.debug("error-controller.js", "initialize()", "START", "controller 'errorController'");
			
			$scope.code = $stateParams.error.code;
				
			$scope.message = $stateParams.error.message;
				
            commonService.log.debug("error-controller.js", "initialize()", "DEBUG", "code="+$scope.code, ", message="+$scope.message);
        };

        
        

        // INIT
        $scope.initialize();
    }
    
})();