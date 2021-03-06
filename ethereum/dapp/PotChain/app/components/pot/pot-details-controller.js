'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-details-controller.js
     ******************************************/
    angular.module('PotChain').controller('potDetailsController', potDetailsController);
    
    potDetailsController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$stateParams', '$uibModal', 'init', 'PotContractService', 'currencyConverterService', 'CURRENCIES', 'Notification', 'commonService'];

    function potDetailsController ($scope, $rootScope, $log, $state, $stateParams, $uibModal, init, PotContractService, currencyConverterService, CURRENCIES, Notification, commonService) {
    
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
			
                PotContractService.sendContribution($scope.address, $scope.contribution.username, $scope.contribution.message, $rootScope.account.address, $scope.contribution.amountEther).then(function(receipt) {   
					Notification.success({message: "Transaction completed <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/tx/"+receipt.transactionID+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a> [Gas used: " + receipt.gasUsed + "]", replaceMessage: true, delay: 10000, closeOnClick: false});
                    
					$scope.getDetails();
                    $scope.getContributions(1, 20);
                    $scope.contribution = null;
					$rootScope.reloadBalance();
					
					$scope.$broadcast('show-errors-reset');
                    
                    commonService.log.debug("pot-details-controller.js", "sendContribution()", "END", "transaction="+receipt.transactionID);
                    
                }, function(error) {
                    commonService.log.error("pot-details-controller.js", "sendContribution()", "END", "error="+error);
                    Notification.error({message: error.message.substr(0, 250), replaceMessage: true});
                });
                
            } else {
                $scope.$broadcast('show-errors-check-validity');
            }
        };
		
		$scope.estimateSendContribution = function() {
            commonService.log.debug("pot-details-controller.js", "estimateSendContribution()", "START");
          
            if ($scope.form.$valid && !$scope.pot.ended) {

                PotContractService.sendContribution.estimate($scope.address, $scope.contribution.username, $scope.contribution.message, $rootScope.account.address, $scope.contribution.amountEther).then(function(gasEstimation) {   

                    commonService.log.debug("pot-details-controller.js", "estimateSendContribution()", "END", "gasEstimation="+gasEstimation);
					
					$uibModal.open({
						templateUrl	: 'views/modal-alert.html',
						controller	: 'modalAlertController',
						size		: 'lg',
						resolve		: {
							title	: function () {
								return "Gas estimation";
							}, 
							message	: function () {
								return "This transaction has an gas estimation of " +gasEstimation+ " ether(s)";
							}
						}
					}).result.then(function (result) {
						$scope.sendContribution();
					});
                    
                }, function(error) {
                    commonService.log.error("pot-details-controller.js", "estimateSendContribution()", "END", "error="+error);
                });

            } else {
                $scope.$broadcast('show-errors-check-validity');
            }
		};
		
        $scope.withdraw = function() {
            commonService.log.debug("pot-details-controller.js", "withdraw()", "START");
            
			if(!$scope.pot.ended) {
				Notification.primary({message: "Transaction in progress ... <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/address/"+$rootScope.account.address+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a>", delay: null, closeOnClick: false});
				
				PotContractService.withdraw($scope.address, $rootScope.account.address).then(function(receipt) {   
					Notification.success({message: "Transaction completed <a type='button' class='btn btn-link' href='"+$rootScope.network.eherscan+"/tx/"+receipt.transactionID+"' target='_blank'><span class='glyphicon glyphicon-info-sign'></span></a> [Gas used: " + receipt.gasUsed + "]", replaceMessage: true, delay: 10000, closeOnClick: false});
						
					$scope.getDetails();
					$rootScope.reloadBalance();
						
					commonService.log.debug("pot-details-controller.js", "withdraw()", "END", "transaction="+receipt.transactionID);
						
				}, function(error) {
					commonService.log.error("pot-details-controller.js", "withdraw()", "END", "error="+error);
					Notification.error({message: error.message.substr(0, 250), replaceMessage: true});
				});
			} else {
				commonService.log.debug("pot-details-controller.js", "withdraw()", "DEBUG", "Cannot withdraw : pot ended");
			}

        };
		

		
        $scope.estimateWithdraw = function() {
            commonService.log.debug("pot-details-controller.js", "estimateWithdraw()", "START");
            
			if(!$scope.pot.ended) {
				PotContractService.withdraw.estimate($scope.address, $rootScope.account.address).then(function(gasEstimation) {   
					commonService.log.debug("pot-details-controller.js", "estimateWithdraw()", "END", "gasEstimation="+gasEstimation);
					
					$uibModal.open({
						templateUrl	: 'views/modal-alert.html',
						controller	: 'modalAlertController',
						size		: 'lg',
						resolve		: {
							title	: function () {
								return "Gas estimation";
							}, 
							message	: function () {
								return "This transaction has an gas estimation of " +gasEstimation+ " ether(s)";
							}
						}
					}).result.then(function (result) {
						$scope.withdraw();
					});
					
				}, function(error) {
					commonService.log.error("pot-details-controller.js", "estimateWithdraw()", "END", "error="+error);
				});
			} else {
				commonService.log.debug("pot-details-controller.js", "estimateWithdraw()", "DEBUG", "Cannot withdraw : pot ended");
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