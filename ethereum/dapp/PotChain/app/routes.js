'use strict';
(function(){
    
    /******************************************
     **** routes.js
     ******************************************/
    angular.module('PotChain')
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            /*******************************************************
             * HOME
            *******************************************************/
            .state('home', {
                url         : '/home',
                templateUrl : 'views/home.html',
                controller  : 'homeController'
            })
            
            /*******************************************************
            * POTS LIST
            *******************************************************/
            .state('pot-list', {
                url         : '/pot/',
                templateUrl : 'views/pot-list.html',
                controller  : 'potListController'
            })
            
            /*******************************************************
            * CREATE POT
            *******************************************************/
            .state('pot-create', {
                url         : '/pot/create',
                templateUrl : 'views/pot-create.html',
                controller  : 'potCreateController'
            })
            
            /*******************************************************
            * POT
            *******************************************************/
            .state('pot', {
                url         : '/pot/:address',
                templateUrl : 'views/pot.html',
                controller  : 'potDetailsController'
            })
            
            
            /*******************************************************
            * ABOUT
            ******************************************************
            .state('about', {
                url         : '/about',
                templateUrl : 'about.html',
                controller  : 'aboutController'
            })*/
            
            /*******************************************************
            * ERROR
            ******************************************************
            .state('error', {
                url         : '/error',
                templateUrl : 'error.html',
                controller  : 'errorController',
                params      : {
                    error       : {
                        code        : 0,
                        message     : 'no error'
                    }
                }
            });*/
    });

})();
