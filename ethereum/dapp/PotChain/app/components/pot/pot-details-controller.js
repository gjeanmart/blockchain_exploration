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
          
            if ($scope.form.$valid && !$scope.pot.ended) {
				Notification.primary({message: "Transaction in progress ... <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/address/"+$rootScope.account.address+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a>", delay: null, closeOnClick: false});
			
                PotContractService.sendContribution($scope.address, $scope.contribution.username, $scope.contribution.message, $rootScope.account.address, $scope.contribution.amountEther).then(function(transaction) {   
					Notification.success({message: "Transaction completed <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/tx/"+transaction+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a>", replaceMessage: true, delay: 10000, closeOnClick: false});
                    
					$scope.getDetails();
                    $scope.getContributions(1, 20);
                    $scope.contribution = null;
					$rootScope.reloadBalance();
					
					$scope.$broadcast('show-errors-reset');
                    
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
            
			if(!$scope.pot.ended) {
				Notification.primary({message: "Transaction in progress ... <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/address/"+$rootScope.account.address+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a>", delay: null, closeOnClick: false});
				
				PotContractService.withdraw($scope.address, $rootScope.account.address).then(function(transaction) {   
					Notification.success({message: "Transaction completed <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/tx/"+transaction+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a>", replaceMessage: true, delay: 10000, closeOnClick: false});
						
					$scope.getDetails();
					$rootScope.reloadBalance();
						
					commonService.log.debug("pot-details-controller.js", "withdraw()", "END", "transaction="+transaction);
						
				}, function(error) {
					commonService.log.error("pot-details-controller.js", "withdraw()", "END", "error="+error);
					Notification.error({message: error.message.substr(0, 250), replaceMessage: true});
				});
			} else {
				commonService.log.debug("pot-details-controller.js", "withdraw()", "DEBUG", "Cannot withdraw : pot ended");
			}

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