'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-create-controller.js
     ******************************************/
    angular.module('PotChain').controller('potCreateController', potCreateController);
    
    potCreateController.$inject  = ['$scope', '$rootScope', '$log', '$state', 'init', 'CURRENCIES', 'PotRegistryContractService', 'currencyConverterService', 'Notification', 'commonService'];

    function potCreateController ($scope, $rootScope, $log, $state, init, CURRENCIES, PotRegistryContractService, currencyConverterService, Notification, commonService) {

        var crtl = this;
    
        $scope.initialize = function() {
            commonService.log.debug("pot-create-controller.js", "initialize()", "START");
        
            $scope.pot = {};
        
            init.then(function(account) {
                commonService.log.debug("pot-create-controller.js", "initialize()", "DEBUG","account="+account.address);
                
                if($rootScope.account.balanceDisplayed === undefined) {
                    $scope.currency = CURRENCIES[0];    
                } else {
                    $scope.currency = $rootScope.account.balanceDisplayed.currency;
                }
            });
        };

        $scope.selectCurrency = function(currency) {
            commonService.log.debug("pot-create-controller.js", "selectCurrency(currency="+currency+")", "START");
            
            $scope.currency = currency;
            
            $scope.calculateAmountEther(currency);
            
            commonService.log.debug("pot-create-controller.js", "selectCurrency(currency="+currency+")", "END");
        };
        
        $scope.calculateAmountEther = function(currency) {          
            commonService.log.debug("pot-create-controller.js", "calculateAmountEther(currency="+currency+")", "START");
            
            if(CURRENCIES[0].id != $scope.currency.id) {
                currencyConverterService.convert($scope.currency.id, CURRENCIES[0].id, $scope.pot.goal).then(function (result) {
                    $scope.pot.goalEther = result;

                    commonService.log.debug("pot-create-controller.js", "calculateAmountEther(currency="+currency+")", "END", "goal(eth)="+$scope.pot.goalEther);
                });
                
            } else {
                $scope.pot.goalEther = $scope.pot.goal;
                
                commonService.log.debug("pot-create-controller.js", "calculateAmountEther(currency="+currency+")", "END", "goal(eth)="+$scope.pot.goalEther);
            }       
        };
        
        $scope.createPot = function() {
            commonService.log.debug("pot-create-controller.js", "createPot()", "START");
            
            if ($scope.form.$valid) {           
                PotRegistryContractService.createPot($rootScope.account.address, $scope.pot.name, $scope.pot.description, $scope.pot.endDate.getTime(), $scope.pot.goalEther, $scope.pot.recipient).then(function(transaction) {            
                    commonService.log.debug("pot-create-controller.js", "createPot()", "END", "transaction="+transaction);

                    Notification.primary({message: "Creating pot ... <a type='button' class='btn btn-info' href='https://testnet.etherscan.io/tx/"+transaction+"' target='_blank'>Info</a>", replaceMessage: true, delay: null});
                    
                    $state.go('pot-list');
                    
                }, function(error) {
                    commonService.log.error("pot-create-controller.js", "createPot()", "END", "error="+error);
                    Notification.error({message: error.message.substr(0, 250), replaceMessage: true});
                });
                
            } else {
                $scope.$broadcast('show-errors-check-validity');
            }
        };
        
        

        // INIT
        $scope.initialize();
    }
    
})();