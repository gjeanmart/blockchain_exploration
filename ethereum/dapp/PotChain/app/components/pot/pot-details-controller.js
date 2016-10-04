'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-details-controller.js
     ******************************************/
    angular.module('PotChain').controller('potDetailsController', potDetailsController);
    
    potDetailsController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$stateParams', 'init', 'PotContractService', 'currencyConverterService', 'CURRENCIES', 'Notification', 'commonService'];

    function potDetailsController ($scope, $rootScope, $log, $state, $stateParams, init, PotContractService, currencyConverterService, CURRENCIES, Notification, commonService) {
    
        $scope.initialize = function() {
           commonService.log.debug("pot-details-controller.js", "initialize()", "START");
        
            init.then(function(account) {
                commonService.log.debug("pot-details-controller.js", "initialize()", "DEBUG", "account="+account.address);
                
                if($rootScope.account.balanceDisplayed === undefined) {
                    $scope.currency = CURRENCIES[0];    
                } else {
                    $scope.currency = $rootScope.account.balanceDisplayed.currency;
                }
                
                $scope.address = $stateParams.address;
                
                $scope.getDetails();
                $scope.getContributions(1, 20);
            });
        };
        
        $scope.getDetails = function() {
            commonService.log.debug("pot-details-controller.js", "getDetails()", "START");
            
            PotContractService.getPot($scope.address).then(function (result) {
                $scope.pot = result;
        
                commonService.log.debug("pot-details-controller.js", "getDetails()", "END", "name="+$scope.pot.name);
                
            }, function (error) {
                commonService.log.error("pot-details-controller.js", "getDetails()", "END", "error="+error);
            });
        };
        
        $scope.getContributions = function(page, size) {
            commonService.log.debug("pot-details-controller.js", "getContributions(page="+page+", size="+size+")", "START");
            
            PotContractService.getContributions($scope.address, page, size).then(function (result) {
                $scope.contributions = result.data;
                
                commonService.log.debug("pot-details-controller.js", "getContributions(page="+page+", size="+size+")", "END", "Nb Contributions:"+result.total);
                
            }, function (error) {
                commonService.log.error("pot-details-controller.js", "getContributions(page="+page+", size="+size+")", "END", "error="+error);
            });
        };
        
        $scope.sendContribution = function() {
            commonService.log.debug("pot-details-controller.js", "sendContribution()", "START");
            
            if ($scope.form.$valid) {

                PotContractService.sendContribution($scope.address, $scope.contribution.username, $scope.contribution.message, $rootScope.account.address, $scope.contribution.amountEther).then(function(transaction) {   
					Notification.primary({message: "Transaction <a type='button' class='btn btn-link' href='https://testnet.etherscan.io/tx/"+transaction+"' target='_blank'>Info</a>", replaceMessage: true, delay: null});   
					
					$scope.getDetails();
                    $scope.getContributions(1, 20);
                    $scope.contribution = null;
                    
                    commonService.log.debug("pot-details-controller.js", "sendContribution()", "END", "transaction="+transaction);
                    
                }, function(error) {
                    commonService.log.error("pot-details-controller.js", "sendContribution()", "END", "error="+error);
                    Notification.error({message: error.message.substr(0, 250), replaceMessage: true});
                });
                
            } else {
                $scope.$broadcast('show-errors-check-validity');
            }
        };
		
        $scope.withdraw = function() {
            commonService.log.debug("pot-details-controller.js", "withdraw()", "START");
            
            PotContractService.withdraw($scope.address, $rootScope.account.address).then(function(transaction) {   
			Notification.primary({message: "Transaction <a type='button' class='btn btn-link' href='https://testnet.etherscan.io/tx/"+transaction+"' target='_blank'>Info</a>", replaceMessage: true, delay: null});   
					
					
			$scope.getDetails();
                    
			commonService.log.debug("pot-details-controller.js", "withdraw()", "END", "transaction="+transaction);
                    
			}, function(error) {
				commonService.log.error("pot-details-controller.js", "withdraw()", "END", "error="+error);
				Notification.error({message: error.message.substr(0, 250), replaceMessage: true});
			});
        };

        $scope.selectCurrency = function(currency) {
            commonService.log.debug("pot-details-controller.js", "selectCurrency(currency="+currency+")", "START");
            
            $scope.currency = currency;
            
            $scope.calculateAmountEther(currency);
            
            commonService.log.debug("pot-details-controller.js", "selectCurrency(currency="+currency+")", "END");
        };
        
        $scope.calculateAmountEther = function(currency) {
            commonService.log.debug("pot-details-controller.js", "calculateAmountEther(currency="+currency+")", "START");

            if(CURRENCIES[0].id != $scope.currency.id) {
                currencyConverterService.convert($scope.currency.id, CURRENCIES[0].id, $scope.contribution.amount).then(function (result) {
                    $scope.contribution.amountEther = result;
                    
                    commonService.log.debug("pot-details-controller.js", "calculateAmountEther(currency="+currency+")", "END", "amount(eth)="+$scope.contribution.amountEther);
                });
                
            } else {
                $scope.contribution.amountEther = $scope.contribution.amount;
                
                commonService.log.debug("pot-details-controller.js", "calculateAmountEther(currency="+currency+")", "END", "amount(eth)="+$scope.contribution.amountEther);
            }       
        };

        // INIT
        $scope.initialize();
    }
    
})();