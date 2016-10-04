'use strict';
(function(){
    
    /******************************************
     **** components/home/home-controller.js
     ******************************************/
    angular.module('PotChain').controller('homeController', homeController);
    
    homeController.$inject  = ['$scope', '$rootScope', '$log', '$state', 'init', 'commonService'];

    function homeController ($rootScope, $scope, $log, $state, init, commonService) {

        $scope.initialize = function() {
            commonService.log.debug("home-controller.js", "initialize()", "START", "controller 'homeController'");
        
            init.then(function(account) {
                commonService.log.debug("home-controller.js", "initialize()", "DEBUG", "account="+account.address);
            });
        };

        
        

        // INIT
        $scope.initialize();
    }
    
})();