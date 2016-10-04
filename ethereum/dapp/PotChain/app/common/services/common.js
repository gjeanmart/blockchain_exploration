'use strict';
(function(){
    
    /******************************************
     **** common/service/common.js
     ******************************************/
    angular.module('PotChain').service('commonService', commonService);
    
    commonService.$inject  = ['$log', '$filter'];

    function commonService ($log, $filter) {
        var service = this;
        
        service.log = {
            debug : function(file, fct, step, message) {
                if(message === undefined) message = "";
                
                $log.debug($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " ["+file+" / "+fct+"] ("+step+") " +message);
            },
            error  : function(file, fct, step, message) {
                if(message === undefined) message = "";
                
                $log.error($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss') + " ["+file+" / "+fct+"] ("+step+") " +message);
            }
        };
    }
    
})();