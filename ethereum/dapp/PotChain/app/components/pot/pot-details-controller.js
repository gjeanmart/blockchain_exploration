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
				$scope.message = {
					username: account.address
				};
				
				$scope.getDetails();
				$scope.getMessages(1, 20);
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
		
		$scope.getMessages = function(page, size) {
			$log.debug("[pot-details-controller.js - getMessages()] (START)");
			
			PotContractService.getMessages($scope.address, page, size).then(function (result) {
				$scope.messages = result.data;
				$log.debug("[pot-details-controller.js - getMessages()] (END)");
				
			}, function (error) {
				$log.error("[pot-details-controller.js - getMessages()] (ERROR) error="+error);
			});
		};
		
		$scope.sendMessage = function() {
			$log.debug("[pot-details-controller.js - sendMessage()] (START)");

			if ($scope.form.$valid) {

				PotContractService.sendMessage($scope.address, $scope.message.username, $scope.message.text, $rootScope.account.address).then(function(transaction) {		
					$log.debug("[pot-details-controller.js - sendMessage()] (END): transaction="+transaction);

					$scope.getMessages(1, 20);
					
				}, function(error) {
					$log.error("[pot-details-controller.js - sendMessage()](ERROR): error="+error);

				});
				
			} else {
				$scope.$broadcast('show-errors-check-validity');
			}
		};


        // INIT
        $scope.initialize();
    }
    
})();