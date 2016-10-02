'use strict';
(function(){
    
    /******************************************
     **** common/directives/back.js
     ******************************************/
	angular.module('PotChain').directive('back', ['$window', function($window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				elem.bind('click', function () {
					$window.history.back();
				});
			}
		};
	}]);
	
})();	