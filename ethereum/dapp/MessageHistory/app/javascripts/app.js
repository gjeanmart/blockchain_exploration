

var app = angular.module('messageHistory', [ 'ngRoute',  'ngResource'])

/**
 * CONSTANTS
 */
.constant('RPC_URL', 'http://130.211.50.165:8545')

/**
 * CONFIG
 */
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
		when('/chat', {
			templateUrl: 'chat.html',
			controller: 'chatController'
		}).
		otherwise({
			redirectTo: '/chat'
		});
	}
])


/**
 * FACTORY
 */
.factory( 'init', function ($log, $q, RPC_URL, $rootScope, CommonEthService) {
	
	$log.debug("[START] factory/init ()");
		
	return $q(function(resolve, reject) 	{
		web3.setProvider(new web3.providers.HttpProvider(RPC_URL));
		
		$rootScope.messageHistoryContract = MessageHistory.deployed();
		
		$rootScope.account = CommonEthService.getAccount().then(function(account) {
			$rootScope.account = account;
			
			$log.debug("[END] factory/init () : " + account);
			
			resolve(account)
			
		}, function(error) {
			$log.error("[ERROR] factory/init ()" + error);
			reject(error);
		});
	});
})

/**
 * SERVICES
 */
.service('MessageHistoryEthContractService', function ($log, $q, $rootScope) {
    var service = this;
    
	service.sendMessage = function (account, message) {
		$log.debug("[START] MessageHistoryEthContractService.sendMessage(account="+account+", message="+message+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.messageHistoryContract.sendMessage(message, {from: account}).then(function(transaction) {
				$log.debug("[END] MessageHistoryEthContractService.sendMessage(account="+account+", message="+message+") : " + transaction);
				resolve(transaction);
			});
		});
    };
	
	service.getMessages = function (account) {
		$log.debug("[START] MessageHistoryEthContractService.getMessages(account="+account+")");
		
		return $q(function(resolve, reject) 	{
			
			$rootScope.messageHistoryContract.getMessages.call({from: account}).then(function(result) {
				var messages = [];
				
				for(var i = 0; i < result[0].length; i++) {
					var msg = {
						date		: new Date(result[2][i].c[0]*1000),
						sender		: result[1][i],
						text		: web3.toAscii(result[0][i])
					}
					
					messages.push(msg);
				}
				
				$log.debug("[END] MessageHistoryEthContractService.getMessages(account="+account+") : " + messages);
				
				resolve(messages);
			});
		});

	};
})
.service('CommonEthService', function ($log, $q) {
    var service = this;
    
	service.getAccount = function () {
		$log.debug("[START] CommonEthService.getAccount()");
		
		return $q(function(resolve, reject) 	{
			web3.eth.getAccounts(function(err, accs) {
				if (err != null) {
					$log.error("[ERROR] CommonEthService.getAccount() : There was an error fetching your accounts.");
					reject("There was an error fetching your accounts.");
				}

				if (accs.length == 0) {
					$log.error("[ERROR] CommonEthService.getAccount() : Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
					reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
				}

				$log.debug("[END] CommonEthService.getAccount() : account=" + accs[0]);
				
				resolve(accs[0]);
			});
		});

    };
	
	service.getBalance = function (account) {
		$log.debug("[START] CommonEthService.getBalance(account="+account+")");
		
		var balance = web3.fromWei(web3.eth.getBalance(account), "ether");
		
		$log.debug("[END] CommonEthService.getBalance(account="+account+") : " + balance);
		
		return balance;
    };
})

/**
 * CONTROLLERS
 */
.controller('chatController', function ($rootScope, $scope, $log, $filter, init, CommonEthService, MessageHistoryEthContractService) {
    var crtl = this;
        
    init.then(function(account) {
		$log.debug("[START] chatController.initialize (account="+account+")");
		
		$scope.account = account;
		
		$scope.getBalance();
		$scope.getMessages();
		
		$log.debug("[END] chatController.initialize (account="+account+")");
    });
	
	$scope.getBalance = function() {
		$log.debug("[START] chatController.getBalance (account="+$scope.account+")");
		
		$scope.balance = CommonEthService.getBalance($scope.account);
		
		$log.debug("[END] chatController.getBalance (account="+$scope.account+") : " + $scope.balance);	
	};
	
	$scope.getMessages = function() {
		$log.debug("[START] chatController.getMessages (account="+$scope.account+")");
		
		MessageHistoryEthContractService.getMessages($scope.account).then(function(messages) {
			$log.debug("[DEBUG] chatController.getMessages (account="+$scope.account+")");
			$log.debug(messages);
			$scope.messages = messages;
			
			$log.debug("[END] chatController.getMessages (account="+$scope.account+") : " + messages.length);
			
		}, function(error) {
			$log.error("[ERROR] chatController.getMessages (account="+$scope.account+")" + error);
		});
	};
	
	$scope.sendMessage = function() {
		$log.debug("[START] chatController.sendMessage (account="+$scope.account+", message="+$scope.message+")");
		
		MessageHistoryEthContractService.sendMessage($scope.account, $scope.message).then(function(transaction) {
			$scope.getMessages();
			$scope.getBalance();
			$scope.message = "";
			
			$log.debug("[END] chatController.sendMessage (account="+$scope.account+", message="+$scope.message+") : " + transaction);
			
		}, function(error) {
			$log.error("[ERROR] chatController.sendMessage (account="+$scope.account+", message="+$scope.message+") : " + error);
		});
	};
})

/**
 * RUN
 */
.run(function($rootScope, $log, RPC_URL, CommonEthService) {
	
});
