'use strict';
(function(){
    
    /******************************************
     **** app.js
     **** Entry point for the AngularJS application
     **** 
     **** Define the application's name  and a list of mdoules (libraries)
     ******************************************/
    angular.module('PotChain', 
        [   'ui.router',  
            'ngResource', 
            'ui-notification', 
            'ui.bootstrap', 
            'ui.bootstrap.showErrors',
			'ngTable',
			'angular-clipboard',
			'ui.gravatar'
        ]
    );
    
})();