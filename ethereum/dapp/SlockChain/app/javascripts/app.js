
var app = angular.module('SlockChain', [ 'ui.router',  'ngResource', 'ui-notification', 'ui.bootstrap', 'ui.bootstrap.showErrors'])

/**
 * CONSTANTS
 */
.constant('RPC_URL'				, 'http://130.211.50.165:8545')
.constant('VERSION'				, '0.1.2')
.constant('DEBUG'				, true)
.constant('TIPS_ADDRESS'		, '0x9eea66Cad10901979AEc87B8010a5D5844D5Ff6a')
.constant('NETWORKS'			, [	{
										id		: 1,
										name	: 'LIVE'
									}, {
										id		: 2,
										name	: 'TEST MORDEN'
									}, {
										id		: 1473506519830,
										name	: 'DEV'
									}])
.constant('CURRENCIES'			, [	{
										id		: 'ETH',
										name	: 'Ether',
									},{
										id		: 'USD',
										name	: 'US Dollar',
										symbol	: '$'
									}, {
										id		: 'EUR',
										name	: 'Euro',
										symbol	: '€'
									}, {
										id		: 'GBP',
										name	: 'British Pound',
										symbol	: '£'
									}])


/**
 * CONFIG
 */
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");

	$stateProvider
		/*******************************************************
		 * HOME
		*******************************************************/
		.state('home', {
			url			: '/home',
			templateUrl	: 'channels.html',
			controller	: 'channelListController'
		})
	    
		/*******************************************************
		* CHANNEL
		*******************************************************/
		.state('channel', {
			url			: '/channel/:channelId',
			templateUrl	: 'channel.html',
			controller	: 'channelController'
		})
	    
		/*******************************************************
		* ACCOUNT
		*******************************************************/
		.state('account', {
			url			: '/account',
			templateUrl	: 'account.html',
			controller	: 'accountController'
		})
	    
		/*******************************************************
		* ABOUT
		*******************************************************/
		.state('about', {
			url			: '/about',
			templateUrl	: 'about.html',
			controller	: 'aboutController'
		})
	    
		/*******************************************************
		* ERROR
		*******************************************************/
		.state('error', {
			url			: '/error',
			templateUrl	: 'error.html',
			controller	: 'errorController',
			params		: {
				error 		: {
					code		: 0,
					message		: 'no error'
				}
			}
		})
	    
		/*******************************************************
		* SIGN UP
		*******************************************************/
		.state('signup', {
			url			: '/signup',
			templateUrl	: 'signup.html',
			controller	: 'signupController'
		})
})

.config(function($logProvider, DEBUG){
  $logProvider.debugEnabled(DEBUG);
})

.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
	showErrorsConfigProvider.showSuccess(true);
}])

.config(function(NotificationProvider) {
	NotificationProvider.setOptions({
		delay				: 10000,
		startTop			: 20,
		startRight			: 10,
		verticalSpacing		: 20,
		horizontalSpacing	: 20,
		positionX			: 'left',
		positionY			: 'bottom'
    });
})

/**
 * FACTORY
 */
.factory( 'init', function ($log, $q, $state, RPC_URL, $rootScope, CommonEthService) {
	
	$log.debug("[START] FACTORY / init()");
		
	return $q(function(resolve, reject) {
		$log.debug("[DEBUG] FACTORY / init() : promise (RPC_URL="+RPC_URL+")");
		
		// Get WEB3
		if(typeof web3 !== 'undefined') {
			web3 = new Web3(web3.currentProvider);  
		} else {
			web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
		}
		
		// Get Contract
		$rootScope.contract = {
			SlockChain: SlockChain.deployed()
		};
		$log.debug("[DEBUG] FACTORY / init(): contract address " + $rootScope.contract.SlockChain.address);

		// Get network Info
		$rootScope.network = CommonEthService.getNetwork().then(function(network){
			$log.debug("[DEBUG] FACTORY / init(): network " + network);
			$rootScope.network = network;
			
		}, function(error) {
			$log.error("[DEBUG] FACTORY / init(): error " + error);
			$state.go('error', {
				error : {
					code		: 1,
					message		: error
				}
			});
			reject(error);
		});
		
		// Get addresses
		CommonEthService.getAddresses().then(function(addresses) {
			$rootScope.addresses = addresses;
			$log.debug("[END] FACTORY / init() : " + addresses);
			
			$rootScope.setAccount(addresses[0]);
			
			resolve(addresses)
			
		}, function(error) {
			$log.error("[ERROR] FACTORY / init()" + error);
			
			reject(error);
		});
	});
})

/**
 * SERVICES
 */
.service('SlockChainEthContractService', function ($log, $q, $rootScope) {
    var service = this;
    
	service.createAccount = function (address, username, email) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.createAccount(address="+address+", username="+username+", email="+email+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.createAccount(email, username, {from: address}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.createAccount(address="+address+", username="+username+", email="+email+") : transaction=" + transaction);
				resolve(transaction);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.createAccount(address="+address+", username="+username+", email="+email+") : error=" + error);
				reject(error);
			});
		});
    };
	
	service.updateAccount = function (address, username, email) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.updateAccount(address="+address+", username="+username+", email="+email+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.updateAccount(email, username, {from: address}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.updateAccount(address="+address+", username="+username+", email="+email+") : transaction=" + transaction);
				resolve(transaction);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.updateAccount(address="+address+", username="+username+", email="+email+") : error=" + error);
				reject(error);
			});
		});
    };
    
	service.deleteAccount = function (address) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.deleteAccount(address="+address+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.deleteAccount({from: address}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.deleteAccount(address="+address+") : transaction=" + transaction);
				resolve(transaction);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.deleteAccount(address="+address+") : error=" + error);
				reject(error);
			});
		});
    };
	
	service.getAccount = function (address, sender) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.getAccount(address="+address+", sender="+sender+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.getAccount.call(address, {from: sender}).then(function(result) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.getAccount(address="+address+", sender="+sender+")");
				
				var userExist = result[0];
				if(!userExist) {
					resolve({
						'userExist'	: false, 
						'username'	: null, 
						'email'		: null
					});
					
				} else {
					resolve({
						'userExist'	: true, 
						'username'	: web3.toAscii(result[1]), 
						'email'		: web3.toAscii(result[2])
					});
				}
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.getAccount(address="+address+", sender="+sender+") : error=" + error);
				reject(error);
			});
		});
    };
	
	service.createChannel = function (channelName, address) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.createChannel(channelName="+channelName+", address="+address+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.createChannel(channelName, {from: address}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.createChannel(channelName="+channelName+", address="+address+") : transaction=" + transaction);
				resolve(transaction);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.createChannel(channelName="+channelName+", address="+address+") : error=" + error);
				reject(error);
			});
		});
    };
	
	service.getChannels = function (address) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.getChannels(address="+address+")");
		
		return $q(function(resolve, reject) {
				
			$rootScope.contract.SlockChain.getChannels.call({from: address}).then(function(result) {
				var channels = [];
				
				for(var i = 0; i < result[0].length; i++) {
					var msg = {
						name	: web3.toAscii(result[1][i]),
						id		: result[0][i].c[0]
					};
					
					channels.push(msg);
				}
				
				$log.debug("[END] SERVICE / SlockChainEthContractService.getChannels(address="+address+") : " + channels);
				
				resolve(channels);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.getChannels(address="+address+") : error=" + error);
				reject(error);
			});
		});
	};
	
	service.sendMessage = function (channelId, address, username, message) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", address="+address+", username="+username+", message="+message+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.sendMessage(channelId, message, username, {from: address}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", address="+address+", username="+username+", message="+message+") : transaction=" + transaction);
				resolve(transaction);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", address="+address+", username="+username+", message="+message+") : error=" + error);
				reject(error);
			});
		});
    };
	
	service.getMessages = function (channelId, address) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.getMessages(channelId="+channelId+", address="+address+")");
		
		return $q(function(resolve, reject) {
			
			$rootScope.contract.SlockChain.getMessages.call(channelId, {from: address}).then(function(result) {
				var messages = [];
				
				for(var i = 0; i < result[0].length; i++) {
					var msg = {
						date		: new Date(result[3][i].c[0]*1000),
						sender		: result[2][i],
						text		: web3.toAscii(result[0][i]),
						username	: web3.toAscii(result[1][i])
					};
					
					messages.push(msg);
				}
				
				$log.debug("[END] SERVICE / SlockChainEthContractService.getMessages(channelId="+channelId+", address="+address+") : " + messages);
				
				resolve(messages);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.getMessages(channelId="+channelId+", address="+address+") : error=" + error);
				reject(error);
			});
		});

	};
	
})
.service('CommonEthService', function ($log, $q, $filter, NETWORKS) {
    var service = this;
    
	service.getAddresses = function () {
		$log.debug("[START] SERVICE / CommonEthService.getAddresses()");
		
		return $q(function(resolve, reject) 	{
			web3.eth.getAccounts(function(err, accs) {
				if (err != null) {
					$log.error("[ERROR] SERVICE / CommonEthService.getAddresses() : There was an error fetching your accounts : " + err);
					reject("There was an error fetching your accounts : " + err);
				}

				if (accs.length == 0) {
					$log.error("[ERROR] SERVICE / CommonEthService.getAddresses() : Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
					reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
				}

				$log.debug("[END] SERVICE / CommonEthService.getAddresses() : accounts length = " + accs);

				resolve(accs);
				
			}, function(error) {
				$log.debug("[ERROR] SERVICE / CommonEthService.getAddresses() : error=" + error);
				reject(error);
			});
		});

    };
	
	service.getBalance = function (address) {
		$log.debug("[START] SERVICE / CommonEthService.getBalance(address="+address+")");
		
		return $q(function(resolve, reject) 	{

			web3.eth.getBalance(address, 'latest', null, function(err, result) {
				$log.debug("[ERROR] SERVICE / CommonEthService.getBalance(address="+address+") : error=" + error);
				reject(error);
				
			}, function(err, result) {
				if (err != null) {
					$log.error("[ERROR] CommonEthService.getBalance(address="+address+") : There was an error sending a transaction : " + err);
					reject("There was an error fetching sending your transaction : " + err);
				}
						
				var balance = Number(web3.fromWei(result, "ether"));
				$log.debug("[END] SERVICE / CommonEthService.getBalance(address="+address+") : balance="+balance);
				
				resolve(balance);
			});
		});
    };
	
	service.sendTransaction = function (address, receiver, amount) {
		$log.debug("[START] SERVICE / CommonEthService.sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+")");
		
		return $q(function(resolve, reject) 	{
			
			web3.eth.sendTransaction({from: address, to: receiver, value: web3.toWei(amount, "ether")}, function(err, tx) {
				if (err != null) {
					$log.error("[ERROR] CommonEthService.sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") : There was an error sending a transaction : " + err);
					reject("There was an error fetching sending your transaction : " + err);
				}
						
				$log.debug("[END] SERVICE / CommonEthService.sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") : transaction="+tx);
				
				resolve(tx);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / CommonEthService.sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") : error=" + error);
				reject(error);
			});
			
		});
    };
	
	service.getNetwork = function () {
		$log.debug("[START] SERVICE / CommonEthService.getNetwork()");
		
		return $q(function(resolve, reject) 	{
			
			web3.version.getNetwork(function(err, result) {
				if (err != null) {
					$log.error("[ERROR] SERVICE / CommonEthService.getNetwork() : There was an error sending a transaction : " + err);
					reject("There was an error fetching sending your transaction : " + err);
				}
				
				var networkInfo = {
					'id' 			: result,
					'name' 			: $filter('filter')(NETWORKS, {id: result})[0].name
					//'api' 			: web3.version.api,
					//'ethereum' 		: web3.version.ethereum,
					//'node' 			: web3.version.node,
					//'isConnected' 	: web3.isConnected()
				};

				$log.debug("[END] SERVICE / CommonEthService.getNetwork() : result="+result);

				resolve(networkInfo);
				
			}, function(error) {
				$log.debug("[ERROR] SERVICE / CommonEthService.getNetwork() : error=" + error);
				reject(error);
			});
			
		});
		
    };
})
.service('currencyConverter', function ($log, $q, $http) {
    var service = this;
    
	service.convert = function (from, to, value) {
		$log.debug("[START] SERVICE / currencyConverter.convert(from="+from+", to="+from+", value="+value+")");
		
		return $http({
		  method: 'GET',
		  url: 'https://www.cryptonator.com/api/ticker/'+from.toLowerCase()+'-'+to.toLowerCase()
		}).then(function(response) {
			var rate = response.data.ticker.price;
			var result = value * rate;
			
			$log.debug("[END] SERVICE / currencyConverter.convert(from="+from+", to="+from+", value="+value+") : result="+result);
			
			return result;
			
		}, function(error) {
			$log.debug("[ERROR] SERVICE / currencyConverter.convert(from="+from+", to="+from+", value="+value+") : error="+error);
		});

    };
	

})

/**
 * CONTROLLERS
 */
 .controller('channelListController', function ($rootScope, $scope, $state, $stateParams, $log, $filter, Notification, init, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
        
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / channelListController.init ()");
		
		$scope.getChannels();
		$rootScope.watchLogEvent();
			
		$log.debug("[END] CONTROLLER / channelListController.init()");
    });
	
	$scope.getChannels = function() {
		$log.debug("[START] CONTROLLER / channelListController.getChannels()");
		
		SlockChainEthContractService.getChannels($scope.account.address).then(function(channels) {
			$scope.channels = channels;
			
			$log.debug("[END] CONTROLLER / channelListController.getChannels() : " + channels.length);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelListController.getChannels()" + error);
		});
	};
	

	$scope.createChannel = function() {
		$log.debug("[START] CONTROLLER / channelListController.createChannel ()");
		
		if ($scope.form.$valid) {
			Notification.primary({message: "Creating channel ...", delay: null, positionY: 'bottom', positionX: 'right'});
			
			SlockChainEthContractService.createChannel($scope.channelName, $rootScope.account.address).then(function(transaction) {
				$scope.getChannels();
				$rootScope.getBalance();
				$scope.channelName = "";
				
				
				
				$log.debug("[END] CONTROLLER / channelListController.createChannel() : " + transaction);
				Notification.primary({message: "Channel created [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});

			}, function(error) {
				$log.error("[ERROR] CONTROLLER / channelListController.createChannel() : " + error);
				Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			});
			
		} else {
        	$scope.$broadcast('show-errors-check-validity');
		}
	};
})
.controller('channelController', function ($rootScope, $scope, $stateParams, $log, $filter, init, Notification, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
        
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / channelController.init ()");
		
		$scope.channelId = $stateParams.channelId;

		$scope.getChannels();
		$scope.getMessages();
		$rootScope.watchLogEvent();
		
		$log.debug("[END] CONTROLLER / channelController.init()");
    });
	
	$scope.getChannels = function() {
		$log.debug("[START] CONTROLLER / channelController.getChannels()");
		
		SlockChainEthContractService.getChannels($rootScope.account.address).then(function(channels) {
			$log.debug("[DEBUG] CONTROLLER / channelController.getChannels()");
			$scope.channels = channels;
			
			$scope.channelName =  $filter('filter')($scope.channels, {id: $stateParams.channelId})[0].name;

			$log.debug("[END] CONTROLLER / channelController.getChannels() : nb channels=" + channels.length);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelController.getChannels()" + error);
		});
	};
	
	$scope.getMessages = function() {
		$log.debug("[START] CONTROLLER / channelController.getMessages()");
		
		SlockChainEthContractService.getMessages($scope.channelId, $rootScope.account.address).then(function(messages) {
			$log.debug("[DEBUG] CONTROLLER / channelController.getMessages()");
			$log.debug(messages);
			$scope.messages = messages;
			
			$log.debug("[END] CONTROLLER / channelController.getMessages() : " + messages.length);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelController.getMessages()" + error);
		});
	};
	
	$scope.sendMessage = function() {
		$log.debug("[START] CONTROLLER / channelController.sendMessage ()");
		
		if ($scope.form.$valid) {
			Notification.primary({message: "Sending message ...", delay: null, positionY: 'bottom', positionX: 'right'});
			
			SlockChainEthContractService.sendMessage($scope.channelId, $rootScope.account.address, $rootScope.account.username, $scope.message).then(function(transaction) {
				$scope.getMessages();
				$rootScope.getBalance();
				$scope.message = "";
				
				$log.debug("[END] CONTROLLER / channelController.sendMessage() : " + transaction);
				Notification.primary({message: "Message sent [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
				
			}, function(error) {
				$log.error("[ERROR] CONTROLLER / channelController.sendMessage() : " + error);
				Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			});
			
		} else {
        	$scope.$broadcast('show-errors-check-validity');
		}
	};
	
	 $rootScope.$on("onNewMessage", function(){			
		$scope.getMessages();
	});
})
.controller('aboutController', function ($rootScope, $scope, $log, Notification, init, CommonEthService, TIPS_ADDRESS) {
    var crtl = this;
        
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / aboutController.init()");

		$scope.tipsAddress = TIPS_ADDRESS;
			
		$log.debug("[END] CONTROLLER / aboutController.init()");
    });
	
	$scope.sendTips = function() {
		$log.debug("[START] CONTROLLER / aboutController.sendTips ()");
		
		if ($scope.form.$valid) {
			Notification.primary({message: "Sending tips ...", delay: null, positionY: 'bottom', positionX: 'right'});
			
			CommonEthService.sendTransaction($rootScope.account.address, TIPS_ADDRESS, $scope.amount).then(function(transaction) {		
				$rootScope.getBalance();
				
				$log.debug("[END] CONTROLLER / aboutController.sendTips () : transaction="+transaction);
				Notification.primary({message: "Transaction sent [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
				
			}, function(error) {
				$log.error("[ERROR] CONTROLLER / aboutController.sendTips (): " + error);
				Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			});
			
		} else {
        	$scope.$broadcast('show-errors-check-validity');
		}
	}
})
.controller('accountController', function ($rootScope, $scope, $log, $state, Notification, init, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
     
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / accountController.init()");

	
		$log.debug("[END] CONTROLLER / accountController.init()");
    });
	
	$scope.updateAccount = function() {
		$log.debug("[START] CONTROLLER / accountController.updateAccount()");
		
		if ($scope.form.$valid) {
			Notification.primary({message: "Updating account ...", delay: null, positionY: 'bottom', positionX: 'right'});
			
			SlockChainEthContractService.updateAccount($rootScope.account.address, $rootScope.account.username, $rootScope.account.email).then(function(transaction) {		
				$log.debug("[END] CONTROLLER / signupController.updateAccount() : transaction="+transaction);
				Notification.primary({message: "Account updated [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
				
				$state.go('account');
			
			}, function(error) {
				$log.error("[ERROR] CONTROLLER / signupController.updateAccount(): " + error);
				Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			});	
			
		} else {
			$scope.$broadcast('show-errors-check-validity');
		}
		
	};
	
	$scope.deleteAccount = function() {
		$log.debug("[START] CONTROLLER / accountController.deleteAccount()");
		Notification.primary({message: "Deleting account ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		SlockChainEthContractService.deleteAccount($rootScope.account.address).then(function(transaction) {	
			$log.debug("[END] CONTROLLER / accountController.deleteAccount()");
			Notification.primary({message: "Account deleted [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
			$state.go('home');
		
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / signupController.createAccount(): " + error);
			Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
		});	
		
	};
	
})
.controller('signupController', function ($rootScope, $scope, $log, $state, init, Notification, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
     
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / signupController.init()");

		
		$log.debug("[END] CONTROLLER / signupController.init()");
    });
	 
    $scope.createAccount = function () {
		
		if ($scope.form.$valid) {
			Notification.primary({message: "Creating account ...", delay: null, positionY: 'bottom', positionX: 'right'});
			
			SlockChainEthContractService.createAccount($rootScope.account.address, $rootScope.account.username, $rootScope.account.email).then(function(transaction) {		
				$log.debug("[END] CONTROLLER / signupController.createAccount() : transaction="+transaction);
				Notification.primary({message: "Account created [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
				
				$state.go('home');
				
			}, function(error) {
				$log.error("[ERROR] CONTROLLER / signupController.createAccount(): " + error);
				Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			});	
			
		} else {
			$scope.$broadcast('show-errors-check-validity');
		}
									
    };
})
.controller('errorController', function ($rootScope, $scope, $log, $state, $stateParams, init, Notification, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
     
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / errorController.init()");

		
		$log.debug("[END] CONTROLLER / errorController.init()");
    });
	 
	 $scope.error = $stateParams.error;
})

/**
 * RUN
 */
.run(function($rootScope, $log, $filter, $state, Notification, CommonEthService, SlockChainEthContractService, currencyConverter, VERSION, CURRENCIES) {
	
	// Currencies
	$rootScope.currencies 	= CURRENCIES;
			
	$rootScope.convertBalance = function(currency) {
		$log.debug("[START] RUN / root.convertBalance(currency="+currency.id+")");

		if(CURRENCIES[0].id != currency.id) {
			currencyConverter.convert(CURRENCIES[0].id, currency.id, $rootScope.account.balance).then(function (result) {
				$rootScope.account.balanceDisplayed.amount = result;
				$rootScope.account.balanceDisplayed.currency = currency;

				$log.debug("[END] RUN / root.convertBalance(currency="+currency.id+") result="+result);
			});
			
		} else {
				$rootScope.account.balanceDisplayed.amount = $rootScope.account.balance;
				$rootScope.account.balanceDisplayed.currency = currency;
		}

			
	}
	
	// Accounts Management
	$rootScope.account = {};
	$rootScope.setAccount = function(address) {
		$log.debug("[START] RUN / root.setAccount(address="+address+")");
		
		$rootScope.account.address = address;
		
		$rootScope.getBalance();
		
		SlockChainEthContractService.getAccount(address, address).then(function(result) {
			if(!result.userExist) {
				$state.go('signup');
				
			} else {
				$rootScope.account.username = result.username;
				$rootScope.account.email 	= result.email;
			}
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / root.setAccount(address="+address+") : " + error);
		});
		
		$log.debug("[END] RUN / root.setAccount(address="+address+")");	
	};
	
	// Balance
	$rootScope.getBalance = function() {
		$log.debug("[START] RUN / root.getBalance()");
		
		CommonEthService.getBalance($rootScope.account.address).then(function(balance) {
			$rootScope.account.balance = balance;
			
			if($rootScope.account.balanceDisplayed === undefined) {
				$rootScope.account.balanceDisplayed = {
					currency: CURRENCIES[0],
					amount 	: balance
				};
			} else {
				$rootScope.convertBalance($rootScope.account.balanceDisplayed.currency);
			};
			
			$log.debug("[END] RUN / root.getBalance() : balance=" + balance);
		});
	};
	
	// Events catch
	$rootScope.watchLogEvent = function() {
		$log.debug("[START] RUN / channelController.watchLogEvent()");
		
		$rootScope.contract.SlockChain.Log(function(error, result){
			$log.debug("[DEBUG] RUN / channelController.watchLogEvent() : error="+error);
			$log.debug("[DEBUG] RUN / channelController.watchLogEvent() : result="+result);

			if(result != undefined && result.args != undefined) {
				var messageTitle 	= web3.toAscii(result.args.title)
				var messageText 	= web3.toAscii(result.args.text)
				var messageLevel 	= result.args.level.c[0];
				var messageDate 	= new Date(result.args.date.c[0]*1000);
				var messageAddress 	= result.args.sender;

				if(messageAddress != $rootScope.account.address) {
					var messageFormatted = $filter('date')(messageDate, 'yyyy-MM-dd HH:ss') + " " + messageText;
					
					if(messageLevel == 0) {
						Notification.error({message: messageFormatted, title: messageTitle, replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
					} else if(messageLevel == 1) {
						Notification.success({message: messageFormatted, title: messageTitle, replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
					} else if(messageLevel == 2) {
						Notification.warning({message: messageFormatted, title: messageTitle, replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});	
					} else if(messageLevel == 3) {
						Notification.primary({message: messageFormatted, title: messageTitle, replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});	
					}
					
					$rootScope.$emit("onNewMessage", {});
				}
				

			}

		});
	};
	
	// Navigation
	$rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams){ 
		if($rootScope.account) {
			$rootScope.setAccount($rootScope.account.address);
		}
	});
			
	// Others
	$rootScope.version = VERSION;
});
