'use strict';
(function(){
    
    /******************************************
     **** common/factories/init.js
     ******************************************/
    angular.module('PotChain').factory('init', init);
    
    init.$inject  = ['$log', '$q', '$state', 'RPC_URL', 'CURRENCIES', '$rootScope', 'ethereumService', 'commonService];

    function init ($log, $q, $state, RPC_URL, CURRENCIES, $rootScope, ethereumService, commonService) {
        
        return $q(function(resolve, reject) {
            commonService.log.debug("init.js", "init()", "START");
            
            // Get WEB3
            if(typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider);  
            } else {
                web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
            }

            // Get network Info
            ethereumService.getNetwork().then(function(network){
                commonService.log.debug("init.js", "init()", "DEBUG", "network=" + network.id);
                
                $rootScope.network = network;
                
            }, function(error) {
                commonService.log.error("init.js", "init()", "END", "network/error " + error);
                
                $state.go('error', {
                    error : {
                        code        : 1,
                        message     : error
                    }
                });
                
                reject(error);
            });
            
            // Get addresses
            ethereumService.getAddresses().then(function(addresses) {
                commonService.log.debug("init.js", "init()", "DEBUG", "getAddresses=" + addresses);
                
                $rootScope.account = {};
                $rootScope.account.address = addresses[0];

                // Get Balance
                ethereumService.getBalance($rootScope.account.address).then(function(balance) {
                    commonService.log.debug("init.js", "init()", "DEBUG", "getBalance="+balance);
                    
                    $rootScope.account.balance = balance;
                    
                    if($rootScope.account.balanceDisplayed === undefined) {
                        $rootScope.account.balanceDisplayed = {
                            currency: CURRENCIES[0],
                            amount  : balance
                        };
                    } else {
                        $rootScope.convertBalance($rootScope.account.balanceDisplayed.currency);
                    };
                    
                    commonService.log.debug("init.js", "init()", "END", "account="+$rootScope.account);
                    
                    resolve($rootScope.account);
                });
                
                
            }, function(error) {
                commonService.log.error("init.js", "init()", "END", "getAddresses/error " + error);
                
                reject(error);
            });
        });
        
    }
    
})();