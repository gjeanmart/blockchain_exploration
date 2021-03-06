'use strict';
(function(){

    /******************************************
     **** config.js
     ******************************************/

    /*** CONSTANT ***/
    angular.module('PotChain')
    .constant('RPC_URL'             , 'http://130.211.50.165:8545')
    .constant('VERSION'             , '0.0.1')
    .constant('DEBUG'               , true)
    .constant('DATE_FORMAT'         , 'dd/MM/yyyy')
    .constant('PAGE_SIZE_DEFAULT'   , 10)
    .constant('TIPS_ADDRESS'        , '0x9eea66Cad10901979AEc87B8010a5D5844D5Ff6a')
    .constant('NETWORKS'            , [ {
                                            id      : 1,
                                            name    : 'LIVE',
                                            eherscan: 'https://etherscan.io/'
                                        }, {
                                            id      : 2,
                                            name    : 'TEST MORDEN',
                                            eherscan: 'https://testnet.etherscan.io/'
                                        }, {
                                            id      : 3,
                                            name    : 'TEST ROPSTEN',
                                            eherscan: 'https://testnet.etherscan.io/'
                                        }])
    .constant('CURRENCIES'          , [ {
                                            id      : 'ETH',
                                            name    : 'Ether'
                                        },{
                                            id      : 'BTC',
                                            name    : 'Bitcoin',
											symbol	: '฿'
                                        },{
                                            id      : 'USD',
                                            name    : 'US Dollar',
                                            symbol  : '$'
                                        }, {
                                            id      : 'EUR',
                                            name    : 'Euro',
                                            symbol  : '€'
                                        }, {
                                            id      : 'GBP',
                                            name    : 'British Pound',
                                            symbol  : '£'
                                        }])


    /*** CONFIG ***/
    
    // Enable/disable $log.debug
    .config(function($logProvider, DEBUG){
        $logProvider.debugEnabled(DEBUG);
    })

    // Default configuration for the show-error directive
    .config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
        showErrorsConfigProvider.showSuccess(true);
    }])

    // Notification default configuration
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay               : 60000,
            startTop            : 60,
            startRight          : 10,
            verticalSpacing     : 20,
            horizontalSpacing   : 20,
            positionX           : 'right',
            positionY           : 'top'
        });
    });


})();
