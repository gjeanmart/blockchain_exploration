'use strict';
(function(){
    
    /******************************************
     **** common/controller/modal-alert-controller.js
     ******************************************/
    angular.module('PotChain').controller('modalAlertController', modalAlertController);
    
    modalAlertController.$inject  = ['$scope', '$rootScope', '$log', '$state', '$uibModalInstance','commonService', 'title', 'message'];

    function modalAlertController ($scope, $rootScope, $log, $state, $uibModalInstance, commonService, title, message) {

        var crtl = this;
    
        $scope.initialize = function() {
			commonService.log.debug("modal-alert-controller.js", "initialize()", "START", "title="+title+", message="+message);
			
			$scope.title = title;
			$scope.message = message;
			
        };

		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		};
		
		$scope.submit = function() {
    		$uibModalInstance.close();
		};

        // INIT
        $scope.initialize();
    }
    
})();