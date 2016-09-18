'use strict';
(function(){
    
    /******************************************
     **** run.js
     ******************************************/
    angular.module('PotChain')
    .run(function($rootScope, $log, $filter, $state, Notification, VERSION, CURRENCIES) {
		$log.debug("[run.js] Starting module 'PotChain'");
		
        // Navigation
        $rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams){ 
    
        });
                
        // Constants
        $rootScope.version = VERSION;
        $rootScope.currencies = CURRENCIES;
    });

})();
