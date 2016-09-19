'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-create-controller.js
     ******************************************/
    angular.module('PotChain').controller('potCreateController', potCreateController);
    
    potCreateController.$inject  = ['$scope', '$rootScope', '$log', '$state', 'init', 'CURRENCIES', 'PotRegistryContractService', 'currencyConverterService'];

    function potCreateController ($scope, $rootScope, $log, $state, init, CURRENCIES, PotRegistryContractService, currencyConverterService) {

	    var crtl = this;
	
        $scope.initialize = function() {
            $log.debug("[pot-create-controller.js - initialize()] (START) controller 'potCreateController'");
        
			$scope.pot = {};
		
            init.then(function(account) {
                $log.debug("[pot-create-controller.js - initialize()] (DEBUG) account="+account.address);
				
				if($rootScope.account.balanceDisplayed === undefined) {
					$scope.currency = CURRENCIES[0];	
				} else {
					$scope.currency = $rootScope.account.balanceDisplayed.currency;
				}
            });
        };

		$scope.selectCurrency = function(currency) {
			$log.debug("[pot-create-controller.js - selectCurrency(currency="+currency+")] (START)");
			
			$scope.currency = currency;
			
			$scope.calculateAmountEther(currency);
			
			$log.debug("[pot-create-controller.js - selectCurrency(currency="+currency+")] (END)");
		};
		
		$scope.calculateAmountEther = function(currency) {
			$log.debug("[pot-create-controller.js - calculateAmountEther(currency="+currency+")] (START)");
			
			if(CURRENCIES[0].id != $scope.currency.id) {
				currencyConverterService.convert($scope.currency.id, CURRENCIES[0].id, $scope.pot.goal).then(function (result) {
					$scope.pot.goalEther = result;

					$log.debug("[pot-create-controller.js - calculateAmountEther(currency="+currency+")] (END) goal(eth)="+$scope.pot.goalEther);
				});
				
			} else {
				$scope.pot.goalEther = $scope.pot.goal;
				$log.debug("[pot-create-controller.js - calculateAmountEther(currency="+currency+")] (END) goal(eth)="+$scope.pot.goalEther);
			}		
		};
		
		$scope.createPot = function() {
			$log.debug("[pot-create-controller.js - createPot()] (START)");

			if ($scope.form.$valid) {

				PotRegistryContractService.createPot($rootScope.account.address, $scope.pot.name, $scope.pot.description, $scope.pot.endDate.getTime(), $scope.pot.goalEther).then(function(transaction) {		
					$log.debug("[pot-create-controller.js - createPot()] (END): transaction="+transaction);

					$state.go('pot-list');
					
				}, function(error) {
					$log.error("[pot-create-controller.js - createPot()] (ERROR): error="+error);

				});
				
			} else {
				$scope.$broadcast('show-errors-check-validity');
			}
		}
        
        

        // INIT
        $scope.initialize();
    }
    
})();