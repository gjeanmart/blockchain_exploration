
var app = angular.module('SlockChain', [ 'ui.router',  'ngResource', 'ui-notification', 'ui.bootstrap'])

/**
 * CONSTANTS
 */
.constant('RPC_URL'				, 'http://130.211.50.165:8545')
.constant('VERSION'				, '0.1.1')
.constant('DEBUG'				, true)
.constant('TIPS_ADDRESS'		, '0x9eea66Cad10901979AEc87B8010a5D5844D5Ff6a')
.constant('NETWORKS'			, [{
										id: 1,
										name: 'LIVE'
									}, {
										id: 2,
										name: 'TEST MORDEN'
									}, {
										id: 1473506519830,
										name: 'DEV'
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
})

.config(function($logProvider, DEBUG){
  $logProvider.debugEnabled(DEBUG);
})

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
.factory( 'init', function ($log, $q, RPC_URL, $rootScope, CommonEthService) {
	
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
		});
		
		// Get addresses
		CommonEthService.getAddresses().then(function(addresses) {
			$rootScope.addresses = addresses;
			$log.debug("[END] FACTORY / init() : " + addresses);
			
			if(!$rootScope.account) {
				$rootScope.setAccount(addresses[0]);
			}
			
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
	
	service.getAccount = function (address) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.getAccount(address="+address+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.getAccount.call({from: address}).then(function(result) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.getAccount(address="+address+")");
				
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
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.getAccount(address="+address+") : error=" + error);
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
	
	service.sendMessage = function (channelId, address, message) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", address="+address+", message="+message+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.sendMessage(channelId, message, {from: address}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", address="+address+", message="+message+") : transaction=" + transaction);
				resolve(transaction);
			}, function(error) {
				$log.debug("[ERROR] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", address="+address+", message="+message+") : error=" + error);
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
						date		: new Date(result[2][i].c[0]*1000),
						sender		: result[1][i],
						text		: web3.toAscii(result[0][i])
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

/**
 * CONTROLLERS
 */
 .controller('channelListController', function ($rootScope, $scope, $stateParams, $log, $filter, Notification, init, CommonEthService, SlockChainEthContractService) {
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
		Notification.primary({message: "Sending message ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		SlockChainEthContractService.sendMessage($scope.channelId, $rootScope.account.address, $scope.message).then(function(transaction) {
			$scope.getMessages();
			$rootScope.getBalance();
			$scope.message = "";
			
			$log.debug("[END] CONTROLLER / channelController.sendMessage() : " + transaction);
			Notification.primary({message: "Message sent [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelController.sendMessage() : " + error);
			console.log(error);
			Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
		});
	};
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
		Notification.primary({message: "Sending tips ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		CommonEthService.sendTransaction($rootScope.account.address, TIPS_ADDRESS, $scope.amount).then(function(transaction) {		
			$rootScope.getBalance();
			
			$log.debug("[END] CONTROLLER / aboutController.sendTips () : transaction="+transaction);
			Notification.primary({message: "Transaction sent [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / aboutController.sendTips (): " + error);
			Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
		});
	}
})
.controller('accountController', function ($rootScope, $scope, $log, Notification, init, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
     
    init.then(function(accounts, network) {
		$log.debug("[START] CONTROLLER / accountController.init()");

	
		$log.debug("[END] CONTROLLER / accountController.init()");
    });
	
	$scope.updateAccount = function() {
		$log.debug("[START] CONTROLLER / accountController.updateAccount.init()");

	
		$log.debug("[END] CONTROLLER / accountController.updateAccount.init()");
		
	};
	
	$scope.deleteAccount = function() {
		$log.debug("[START] CONTROLLER / accountController.deleteAccount.init()");

	
		$log.debug("[END] CONTROLLER / accountController.deleteAccount.init()");
		
	};
	
})
.controller('signupController', function ($rootScope, $scope, $log, $uibModalInstance, Notification, init, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
     
    $scope.register = function () {
		$log.debug("[START] CONTROLLER / signupController.register() ");
		Notification.primary({message: "Creating account ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		SlockChainEthContractService.createAccount($rootScope.account.address, $scope.username, $scope.email).then(function(transaction) {		
			$log.debug("[END] CONTROLLER / signupController.register() : transaction="+transaction);
			Notification.primary({message: "Account created [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
			$rootScope.signupModal.close({
				'address'	: $rootScope.account.address ,
				'username'	: $scope.username,
				'email'		: $scope.email
			});	
		
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / signupController.register(): " + error);
			Notification.error({message: error.message.substr(0, 250), replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
		});							
    };
})

/**
 * RUN
 */
.run(function($rootScope, $log, $filter, $uibModal, Notification, CommonEthService, SlockChainEthContractService, VERSION) {
	
	$rootScope.setAccount = function(address) {
		$log.debug("[START] RUN / root.setAccount(address="+address+")");
		
		$rootScope.account = {};
		$rootScope.account.address = address;
		$rootScope.getBalance();
		
		SlockChainEthContractService.getAccount(address).then(function(result) {

			if(!result.userExist) {
				/*
				$rootScope.signupModal = $uibModal.open({
						templateUrl	: 'signup.html',
						controller	: 'signupController',
						size		: 'lg',
						backdrop  	: 'static',
						keyboard  	: false
				}).result.then(function (result) {
					$rootScope.account.address = result.address;
					$rootScope.account.username = result.username;
					$rootScope.account.email 	= result.email;
					
					console.log($rootScope.account);
				});
				*/
			} else {
				$rootScope.account.username = result.username;
				$rootScope.account.email 	= result.email;
			}
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / root.setAccount(address="+address+") : " + error);
		});
		
		$log.debug("[END] RUN / root.setAccount(address="+address+")");	
	};
	

	$rootScope.getBalance = function() {
		$log.debug("[START] RUN / root.getBalance()");
		
		CommonEthService.getBalance($rootScope.account.address).then(function(balance) {
			console.log(balance);
			$rootScope.account.balance = balance;
			$log.debug("[END] RUN / root.getBalance() : balance=" + balance);
		});
	};
	
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
				}
				

			}

		});
	};
	
			
	$rootScope.version = VERSION;
});
