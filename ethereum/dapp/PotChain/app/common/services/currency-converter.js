'use strict';
(function(){
    
    /******************************************
     **** common/service/currency-converter.js
     ******************************************/
    angular.module('PotChain').service('currencyConverterService', currencyConverterService);
    
    currencyConverterService.$inject  = ['$log', '$http', 'commonService'];

    function currencyConverterService ($log, $http, commonService) {
        var service = this;
        
        service.api= 'https://www.cryptonator.com/api/ticker/%s-%s';
    
        service.convert = function (from, to, value) {
            commonService.log.debug("currency-converter.js", "convert(from="+from+", to="+to+", value="+value+")", "START");
            
            return $http({
              method    : 'GET',
              url       : sprintf(service.api, from.toLowerCase(), to.toLowerCase())
            }).then(function(response) {
                var rate = response.data.ticker.price;
                var result = value * rate;
                
                commonService.log.debug("currency-converter.js", "convert(from="+from+", to="+to+", value="+value+")", "END", "result="+result);
                
                return result;
                
            }, function(error) {
                commonService.log.error("currency-converter.js", "convert(from="+from+", to="+to+", value="+value+")", "END", "error="+error);
            });

        };
        
    }
    
})();