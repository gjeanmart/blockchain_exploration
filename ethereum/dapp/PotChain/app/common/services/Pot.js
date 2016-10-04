'use strict';
(function(){
    
    /******************************************
     **** common/service/Pot.js
     ******************************************/
    angular.module('PotChain').service('PotContractService', PotContractService);
    
    PotContractService.$inject  = ['$log', '$q', '$filter', 'commonService'];

    function PotContractService ($log, $q, $filter, commonService) {
        var service = this;
        
        service.getContract = function(contractAddress) {
            return contract = Pot.at(contractAddress);
        };
        
        service.getPot   = function(contractAddress, senderAddress) {
            commonService.log.debug("Pot.js", "getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")", "START");
            
            return $q(function(resolve, reject)     {
                service.getContract(contractAddress).getDetails.call({from: senderAddress}).then(function(result) {
                    $log.debug(result);
                    
                    if(result[0] === "0x") {
                        reject("Pot does not exist");
                    }
                    
                    var pot = {
                        owner       : result[0],
                        name        : web3.toAscii(result[1]),
                        description : web3.toAscii(result[2]),
                        total       : Number(web3.fromWei(result[3].toNumber(), "ether")),
                        startDate   : new Date(result[4].toNumber() * 1000),
                        endDate     : new Date(result[5].toNumber() * 1000),
                        goal        : Number(web3.fromWei(result[6].toNumber(), "ether")),
                        recipient   : result[7],
                        endded      : result[8]
                    };
                    
                    commonService.log.debug("Pot.js", "getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")", "END", "name = " + pot.name);
                    
                    resolve(pot);
                    
                }, function(error) {
                    commonService.log.error("Pot.js", "getPot(contractAddress="+contractAddress+", senderAddress="+senderAddress+")", "END", "error="+error);
                    
                    reject(error);
                });
            });
        };
        
        service.sendMessage  = function(contractAddress, username, message, senderAddress) {            
            commonService.log.debug("Pot.js", "sendMessage(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+")", "START");
                    
            return $q(function(resolve, reject)     {
                service.getContract(contractAddress).sendMessage(username, message, {from: senderAddress}).then(function(transaction) {
                    commonService.log.debug("Pot.js", "sendMessage(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+")", "END", "transaction="+transaction);
                    
                    resolve(transaction);
                    
                }, function(error) {
                    commonService.log.error("Pot.js", "sendMessage(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+")", "END", "error="+error);
                    
                    reject(error);
                });
            });

        };
        
        service.getMessages = function (contractAddress, pageNo, pageSize, senderAddress) {
            commonService.log.debug("Pot.js", "getMessages(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")", "START");
            
            return $q(function(resolve, reject)     {
                service.getContract(contractAddress).getMessages.call(pageNo, pageSize, {from: senderAddress}).then(function(result) {
                    $log.debug(result);
                    
                    var messages = [];
                    
                    for(var i = 0; i < result[0].length; i++) {
                        var message = {
                            sender      : result[2][i],
                            username    : web3.toAscii(result[1][i]),
                            text        : web3.toAscii(result[0][i]),
                            date        : new Date(result[3][i].toNumber() * 1000)
                        };
                        messages.push(message);
                    }
                    
                    commonService.log.debug("Pot.js", "getMessages(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")", "END", "nb result=" + messages.length);
                    
                    resolve({
                        data : messages,
                        total: result[4].toNumber()
                    });
                    
                }, function(error) {
                    commonService.log.error("Pot.js", "getMessages(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")", "END", "error="+error);
                    
                    reject(error);
                });
            });
        };
        
        service.sendContribution = function(contractAddress, username, message, senderAddress, amount) {            
            commonService.log.debug("Pot.js", "sendContribution(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+", amount="+amount+")", "START");
                    
            return $q(function(resolve, reject)     {
                service.getContract(contractAddress).contribute(username, message, {from: senderAddress, value: web3.toWei(amount, "ether")}).then(function(transaction) {
                    commonService.log.debug("Pot.js", "sendContribution(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+", amount="+amount+")", "END", "transaction="+transaction);
                    
                    resolve(transaction);
                    
                }, function(error) {
                    commonService.log.error("Pot.js", "sendContribution(contractAddress="+contractAddress+", senderAddress="+senderAddress+", username="+username+", message="+message+", amount="+amount+")", "END", "error="+error);
                    
                    reject(error);
                });
            });

        };
        
        service.getContributions = function (contractAddress, pageNo, pageSize, senderAddress) {
            commonService.log.debug("Pot.js", "getContributions(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")", "START");
            
            return $q(function(resolve, reject)     {
                service.getContract(contractAddress).getContributions.call({from: senderAddress}).then(function(result) {
                    $log.debug(result);
                    
                    var contributions = [];
                    
                    for(var i = 0; i < result[0].length; i++) {
                        var contribution = {
                            sender      : result[0][i],
                            amount      : Number(web3.fromWei(result[1][i], "ether")),
                            username    : web3.toAscii(result[2][i]),
                            message     : web3.toAscii(result[3][i]),
                            date        : new Date(result[4][i].toNumber() * 1000)
                        };
                        contributions.push(contribution);
                    }
                    
                    commonService.log.debug("Pot.js", "getContributions(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")", "END", "nb result=" + contributions.length);
                    
                    resolve({
                        data : contributions,
                        total: result[5].toNumber()
                    });
                    
                }, function(error) {
                    commonService.log.error("Pot.js", "getContributions(contractAddress="+contractAddress+", senderAddress="+senderAddress+", pageNo="+pageNo+", pageSize="+pageSize+")", "END", "error="+error);
                    
                    reject(error);
                });
            });
        };
        
        service.withdraw = function(contractAddress, senderAddress) {            
            commonService.log.debug("Pot.js", "withdraw(contractAddress="+contractAddress+", senderAddress="+senderAddress+")", "START");
                    
            return $q(function(resolve, reject)     {
                service.getContract(contractAddress).withdraw({from: senderAddress}).then(function(transaction) {
                    commonService.log.debug("Pot.js", "withdraw(contractAddress="+contractAddress+", senderAddress="+senderAddress+")", "END", "transaction="+transaction);
                    
                    resolve(transaction);
                    
                }, function(error) {
                    commonService.log.error("Pot.js", "withdraw(contractAddress="+contractAddress+", senderAddress="+senderAddress+")", "END", "error="+error);
                    
                    reject(error);
                });
            });

        };
        
    }
    
})();