'use strict';
(function(){
    
    /******************************************
     **** common/service/ethereum.js
     ******************************************/
    angular.module('PotChain').service('ethereumService', ethereumService);
    
    ethereumService.$inject  = ['$log', '$q', '$filter', 'NETWORKS', 'commonService'];

    function ethereumService ($log, $q, $filter, NETWORKS, commonService) {
        var service = this;
        
        /**
         * getAddresses
         */
        service.getAddresses = function () {
            commonService.log.debug("ethereum.js", "getAddresses()", "START");
            
            return $q(function(resolve, reject)     {
                web3.eth.getAccounts(function(err, accs) {
                    if (err != null) {
                        commonService.log.error("ethereum.js", "getAddresses()", "END", "There was an error fetching your accounts : " + err);
                        reject("There was an error fetching your accounts : " + err);
                    }

                    if (accs.length == 0) {
                        commonService.log.error("ethereum.js", "getAddresses()", "END", "Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                        reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    }
                    
                    commonService.log.debug("ethereum.js", "getAddresses()", "END", "number of accounts fetched = " + accs.length);

                    resolve(accs);
                    
                }, function(error) {
                    commonService.log.error("ethereum.js", "getAddresses()", "END", "error="+error);
                    reject(error);
                });
            });
        };
        
        service.getBalance = function (address) {
            commonService.log.debug("ethereum.js", "getBalance(address="+address+")", "START");
            
            return $q(function(resolve, reject)     {

                web3.eth.getBalance(address, 'latest', function(err, result) {
                    if (err != null) {
                        commonService.log.error("ethereum.js", "getBalance(address="+address+")", "END", "There was an error sending a transaction : " + err);
                        reject("There was an error fetching sending your transaction : " + err);
                    }
                            
                    var balance = Number(web3.fromWei(result, "ether"));
                    
                    commonService.log.debug("ethereum.js", "getBalance(address="+address+")", "END", "balance(ether)="+balance);
                    
                    resolve(balance);
                });
            });
        };
        
        service.sendTransaction = function (address, receiver, amount) {
            commonService.log.debug("ethereum.js", "sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+")", "START");
            
            return $q(function(resolve, reject)     {
                
                web3.eth.sendTransaction({from: address, to: receiver, value: web3.toWei(amount, "ether")}, function(error) {                   
                    commonService.log.error("ethereum.js", "sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+")", "END", "error=" + error);
                    
                    reject(error);
                    
                }, function(err, tx) {
                    if (err != null) {
                        commonService.log.error("ethereum.js", "sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+")", "END", "There was an error fetching sending your transaction : " + err);
                        
                        reject("There was an error fetching sending your transaction : " + err);
                    }
                            
                    commonService.log.debug("ethereum.js", "sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+")", "END", "transaction=" + tx);
                    
                    resolve(tx);
                });
                
            });
        };
        
        service.getNetwork = function () {
            commonService.log.debug("ethereum.js", "getNetwork()", "START");
            
            return $q(function(resolve, reject)     {
                
                web3.version.getNetwork(function(err, result) {
                    if (err != null) {
                        commonService.log.error("ethereum.js", "getNetwork()", "END", "There was an error getting the network : " + err);
                        
                        reject("There was an error fetching getting the network : " + err);
                    }
                    
                    var networkInfo = {
                        'id'            : result,
                        'name'          : ($filter('filter')(NETWORKS, {id: result})[0] === undefined) ? result : $filter('filter')(NETWORKS, {id: result})[0].name,
                        'eherscan'      : ($filter('filter')(NETWORKS, {id: result})[0] === undefined) ? result : $filter('filter')(NETWORKS, {id: result})[0].eherscan
                        //'api'             : web3.version.api,
                        //'ethereum'        : web3.version.ethereum,
                        //'node'            : web3.version.node,
                        //'isConnected'     : web3.isConnected()
                    };

                    commonService.log.debug("ethereum.js", "getNetwork()", "END", "result=" + result);
                    
                    resolve(networkInfo);
                    
                }, function(error) {
                    commonService.log.error("ethereum.js", "getNetwork()", "END", "error : " + error);
                    
                    reject(error);
                });
                
            });
            
        };
		

        
        service.getGasPrice = function () {
            commonService.log.debug("ethereum.js", "getGasPrice()", "START");
            
            return $q(function(resolve, reject)     {
                
               web3.eth.getGasPrice(function(err, result) {
                    if (err != null) {
                        commonService.log.error("ethereum.js", "getGasPrice()", "END", "There was an error getting the gas price : " + err);
                        
                        reject("There was an error fetching getting the gas price : " + err);
                    }
                    
                    var gasPrice =  Number(web3.fromWei(result, "ether"));

                    commonService.log.debug("ethereum.js", "getGasPrice()", "END", "gasPrice=" + gasPrice);
                    
                    resolve(gasPrice);
                    
                });
                
            });
            
        };
		
        service.getBlockNumber = function () {
            commonService.log.debug("ethereum.js", "getBlockNumber()", "START");
            
            return $q(function(resolve, reject)     {
                
               web3.eth.getBlockNumber(function(err, result) {
                    if (err != null) {
                        commonService.log.error("ethereum.js", "getBlockNumber()", "END", "There was an error getting the blockNumber : " + err);
                        
                        reject("There was an error fetching getting the gas price : " + err);
                    }
                    
                    var blockNumber =  Number(result, "ether");

                    commonService.log.debug("ethereum.js", "getBlockNumber()", "END", "blockNumber=" + blockNumber);
                    
                    resolve(blockNumber);
                    
                });
                
            });
            
        };
		
		/**
		 * Checks if the given string is an address
		 *
		 * @method isAddress
		 * @param {String} address the given HEX adress
		 * @return {Boolean}
		 * @source http://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
		*/
		service.validateAddress = function(address) {
			commonService.log.debug("ethereum.js", "validateAddress(address="+address+")", "START");

			if (!/^(0x)?[0-9a-f]{40}$/i.test(address.toLowerCase())) {
				// check if it has the basic requirements of an address
				return false;
			} else {
				return true;
			}
		};
		
    }
    
})();