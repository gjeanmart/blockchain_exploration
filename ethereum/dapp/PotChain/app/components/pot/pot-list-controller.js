'use strict';
(function(){
    
    /******************************************
     **** components/home/pot-list-controller.js
     ******************************************/
    angular.module('PotChain').controller('potListController', potListController);
    
    potListController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$filter', 'NgTableParams', 'init', 'PotRegistryContractService', 'commonService'];

    function potListController ($scope, $rootScope, $log, $state, $filter, NgTableParams, init, PotRegistryContractService, commonService) {
    
        $scope.initialize = function() {
           commonService.log.debug("pot-list-controller.js", "initialize()", "START");
        
            init.then(function(account) {
                commonService.log.debug("pot-list-controller.js", "initialize()", "DEBUG", " account="+account.address);
            
                $scope.load();
            });
        };

        $scope.load = function() {
            $scope.table = new NgTableParams({
                page    : 1,
                count   : $rootScope.PAGE_SIZE_DEFAULT
            }, {
                total: 0,
                getData: function(params) { 
                    return PotRegistryContractService.getPots($rootScope.account.address, params.page(), params.count()).then(function (result) {
                        commonService.log.debug("pot-list-controller.js", "load()", "END", "total="+result.total);
            
                        params.total(result.total);
                        console.log(result.data);
                        return result.data;

                    }, function (error) {
                        commonService.log.error("pot-list-controller.js", "load()", "END", "error="+error);
                    });
                }
            }); 
        };
        
        $scope.reload = function() {
            $scope.table.reload();
        };
        
        
        // INIT
        $scope.initialize();
    }
    
})();