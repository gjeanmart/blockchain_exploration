'use strict';
(function(){
    
    /******************************************
     **** run.js
     ******************************************/
    angular.module('PotChain')
    .run(['$rootScope', '$log', '$filter', '$state', 'VERSION', 'CURRENCIES', 'PAGE_SIZE_DEFAULT', 'DATE_FORMAT', 'currencyConverterService',
    function($rootScope, $log, $filter, $state, VERSION, CURRENCIES, PAGE_SIZE_DEFAULT, DATE_FORMAT, currencyConverterService) {
        $log.debug("[run.js] Starting module 'PotChain'");
        
        // Convert currency
        $rootScope.convertBalance = function(currency) {
            $log.debug("[run.js / convertBalance(currency="+currency.id+")] (START)");
            
            if(CURRENCIES[0].id != currency.id) {
                currencyConverterService.convert(CURRENCIES[0].id, currency.id, $rootScope.account.balance).then(function (result) {
                    $rootScope.account.balanceDisplayed.amount = result;
                    $rootScope.account.balanceDisplayed.currency = currency;

                    $log.debug("[run.js / convertBalance(currency="+currency.id+")] (END) amount("+currency.id+")="+$rootScope.account.balanceDisplayed.amount);
                });
                
            } else {
                    $rootScope.account.balanceDisplayed.amount = $rootScope.account.balance;
                    $rootScope.account.balanceDisplayed.currency = currency;
                    
                    $log.debug("[run.js / convertBalance(currency="+currency.id+")] (END) amount("+currency.id+")="+$rootScope.account.balanceDisplayed.amount);
            }   
        };
            
		// Date picker
    	$rootScope.datePicker = (function () {
    	    var method		 = {};
    	    method.instances = [];
    	    
    	    method.open = function ($event, instance) {
    	        $event.stopPropagation();
    	        $event.preventDefault();

    	        method.instances[instance] = true;
    	    };
    	    method.getOptions = function (min, max) {
        	    method.options = {
            	        'show-weeks'	: false,
            	        'startingDay'	: 1,
            	        'maxDate'		: max,
            	        'minDate'		: min
            	};
        	    
        	    return method.options;
    	    };

    	    method.datePickerDefaultOption 			= method.getOptions();
    	    method.datePickerDefaultOptionNoFuture 	= method.getOptions(null, new Date());
    	    method.datePickerDefaultOptionNoPast 	= method.getOptions(new Date(), null);

    	    var formats = [DATE_FORMAT]; // TODO injection from property
    	    method.format = formats[0];
    	    method.formatLabel = DATE_FORMAT.toLowerCase();
    	    
    	    return method;
    	}());		
        
        // Navigation
        $rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams){ 
			$log.debug("[run.js / on stateChange()] (DEBUG) toParams="+toParams + ", toState="+toState);
        });
                
        // Constants
        $rootScope.version = VERSION;
        $rootScope.currencies = CURRENCIES;
        $rootScope.PAGE_SIZE_DEFAULT = PAGE_SIZE_DEFAULT;
    }]);

})();
