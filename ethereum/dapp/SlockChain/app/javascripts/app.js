
var app = angular.module('SlockChain', [ 'ui.router',  'ngResource', 'ui-notification', 'ui.bootstrap'])

/**
 * CONSTANTS
 */
.constant('RPC_URL'				, 'http://130.211.50.165:8545')
.constant('VERSION'				, '0.1.0')
.constant('DEBUG'				, true)
.constant('TIPS_ADDRESS'		, '0x9eea66Cad10901979AEc87B8010a5D5844D5Ff6a')



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

		web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
		console.log(web3);
		
		// Get Contract
		$rootScope.contract = {
			SlockChain: SlockChain.deployed() // doesn't work on morden
			//SlockChain: SlockChain.at(CONTRACT_ADDRESS)
		};
		$log.debug("[DEBUG] FACTORY / init(): contract address " + $rootScope.contract.SlockChain.address);

		// Get accounts
		CommonEthService.getAccounts().then(function(accounts) {
			$rootScope.accounts = accounts;
			$log.debug("[END] FACTORY / init() : " + accounts);
			
			resolve(accounts)
			
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
    
	service.createChannel = function (channelName, account) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.createChannel(channelName="+channelName+", account="+account+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.createChannel(channelName, {from: account}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.createChannel(channelName="+channelName+", account="+account+") : transaction=" + transaction);
				resolve(transaction);
			});
		});
    };
	
	service.getChannels = function (account) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.getChannels(account="+account+")");
		
		return $q(function(resolve, reject) {
			
			$rootScope.contract.SlockChain.getChannels.call({from: account}).then(function(result) {
				var channels = [];
				
				for(var i = 0; i < result[0].length; i++) {
					var msg = {
						name	: web3.toAscii(result[1][i]),
						id		: result[0][i].c[0]
					};
					
					channels.push(msg);
				}
				
				$log.debug("[END] SERVICE / SlockChainEthContractService.getChannels(account="+account+") : " + channels);
				
				resolve(channels);
			});
		});
	};
	
	service.sendMessage = function (channelId, account, message) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", account="+account+", message="+message+")");
		
		return $q(function(resolve, reject) 	{
			$rootScope.contract.SlockChain.sendMessage(channelId, message, {from: account}).then(function(transaction) {
				$log.debug("[END] SERVICE / SlockChainEthContractService.sendMessage(channelId="+channelId+", account="+account+", message="+message+") : transaction=" + transaction);
				resolve(transaction);
			});
		});
    };
	
	service.getMessages = function (channelId, account) {
		$log.debug("[START] SERVICE / SlockChainEthContractService.getMessages(channelId="+channelId+", account="+account+")");
		
		return $q(function(resolve, reject) {
			
			$rootScope.contract.SlockChain.getMessages.call(channelId, {from: account}).then(function(result) {
				var messages = [];
				
				for(var i = 0; i < result[0].length; i++) {
					var msg = {
						date		: new Date(result[2][i].c[0]*1000),
						sender		: result[1][i],
						text		: web3.toAscii(result[0][i])
					};
					
					messages.push(msg);
				}
				
				$log.debug("[END] SERVICE / SlockChainEthContractService.getMessages(channelId="+channelId+", account="+account+") : " + messages);
				
				resolve(messages);
			});
		});

	};
	
	
	
	
})
.service('CommonEthService', function ($log, $q) {
    var service = this;
    
	service.getAccounts = function () {
		$log.debug("[START] SERVICE / CommonEthService.getAccount()");
		
		return $q(function(resolve, reject) 	{
			web3.eth.getAccounts(function(err, accs) {
				if (err != null) {
					$log.error("[ERROR] SERVICE / CommonEthService.getAccount() : There was an error fetching your accounts : " + err);
					reject("There was an error fetching your accounts.");
				}

				if (accs.length == 0) {
					$log.error("[ERROR] SERVICE / CommonEthService.getAccount() : Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
					reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
				}

				$log.debug("[END] SERVICE / CommonEthService.getAccount() : accounts length = " + accs);

				resolve(accs);
			});
		});

    };
	
	service.getBalance = function (account) {
		$log.debug("[START] SERVICE / CommonEthService.getBalance(account="+account+")");
		
		var balance = web3.fromWei(web3.eth.getBalance(account), "ether");
		
		$log.debug("[END] SERVICE / CommonEthService.getBalance(account="+account+") : " + balance);
		
		return balance;
    };
	
	service.sendTransaction = function (account, receiver, amount) {
		$log.debug("[START] SERVICE / CommonEthService.sendTransaction(account="+account+", receiver="+receiver+", amount="+amount+")");
		
		return $q(function(resolve, reject) 	{
			
			web3.eth.sendTransaction({from: account, to: receiver, value: web3.toWei(amount, "ether")}, function(err, tx) {
				if (err != null) {
					$log.error("[ERROR] CommonEthService.sendTransaction(account="+account+", receiver="+receiver+", amount="+amount+") : There was an error sending a transaction : " + err);
					reject("There was an error fetching sending your transaction.");
				}
						
				$log.debug("[END] SERVICE / CommonEthService.sendTransaction(account="+account+", receiver="+receiver+", amount="+amount+") : transaction="+tx);
				
				resolve(tx);
			});
			
		});
    };
})

/**
 * CONTROLLERS
 */
 .controller('channelListController', function ($rootScope, $scope, $stateParams, $log, $filter, Notification, init, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
        
    init.then(function(accounts) {
		$log.debug("[START] CONTROLLER / channelListController.init ()");
		
		$rootScope.account = accounts[0];
		
		$scope.getChannels();
		$rootScope.getBalance();
		$rootScope.watchLogEvent();
			
		$log.debug("[END] CONTROLLER / channelListController.init() : account="+account+", channelId=" + $scope.channelId);
    });
	
	$scope.getChannels = function() {
		$log.debug("[START] CONTROLLER / channelListController.getChannels(account="+$rootScope.account+")");
		
		SlockChainEthContractService.getChannels($scope.account).then(function(channels) {
			$log.debug("[DEBUG] CONTROLLER / channelListController.getChannels(account="+$scope.account+")");
			$log.debug(channels);
			$scope.channels = channels;
			
			$log.debug("[END] CONTROLLER / channelListController.getChannels(account="+$rootScope.account+") : " + channels.length);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelListController.getChannels(account="+$rootScope.account+")" + error);
		});
	};
	

	$scope.createChannel = function() {
		$log.debug("[START] CONTROLLER / channelListController.createChannel (account="+$rootScope.account+", channelName="+$scope.channelName+")");
		
		Notification.primary({message: "Creating channel ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		SlockChainEthContractService.createChannel($scope.channelName, $rootScope.account).then(function(transaction) {
			$scope.getChannels();
			$rootScope.getBalance();
			$scope.channelName = "";
			
			$log.debug("[END] CONTROLLER / channelListController.createChannel(account="+$rootScope.account+", channelName="+$scope.channelName+") : " + transaction);
			Notification.primary({message: "Channel created [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelListController.createChannel(account="+$rootScope.account+", channelName="+$scope.channelName+") : " + error);
		});
	};
})
.controller('channelController', function ($rootScope, $scope, $stateParams, $log, $filter, init, Notification, CommonEthService, SlockChainEthContractService) {
    var crtl = this;
        
    init.then(function(accounts) {
		$log.debug("[START] CONTROLLER / channelController.init ()");
		
		$scope.channelId = $stateParams.channelId;
		$rootScope.account = accounts[0];
		
		$rootScope.getBalance();
		$scope.getChannels();
		$scope.getMessages();
		$rootScope.watchLogEvent();
			
		$log.debug("[END] CONTROLLER / channelController.init() : account="+$rootScope.account+", channelId=" + $scope.channelId);
    });
	
	$scope.getChannels = function() {
		$log.debug("[START] CONTROLLER / channelController.getChannels(account="+$rootScope.account+")");
		
		SlockChainEthContractService.getChannels($rootScope.account).then(function(channels) {
			$log.debug("[DEBUG] CONTROLLER / channelController.getChannels(account="+$rootScope.account+")");
			$log.debug(channels);
			$scope.channels = channels;
			
			$log.debug("[END] CONTROLLER / channelController.getChannels(account="+$rootScope.account+") : " + channels.length);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelController.getChannels(account="+$rootScope.account+")" + error);
		});
	};
	
	$scope.getMessages = function() {
		$log.debug("[START] CONTROLLER / channelController.getMessages(account="+$rootScope.account+")");
		
		SlockChainEthContractService.getMessages($scope.channelId, $rootScope.account).then(function(messages) {
			$log.debug("[DEBUG] CONTROLLER / channelController.getMessages(channelId="+$scope.channelId,+", account="+$rootScope.account+")");
			$log.debug(messages);
			$scope.messages = messages;
			
			$log.debug("[END] CONTROLLER / channelController.getMessages(channelId="+$scope.channelId,+", account="+$rootScope.account+") : " + messages.length);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelController.getMessages(channelId="+$scope.channelId,+", account="+$rootScope.account+")" + error);
		});
	};
	
	$scope.sendMessage = function() {
		$log.debug("[START] CONTROLLER / channelController.sendMessage (channelId="+$scope.channelId,+", account="+$rootScope.account+", message="+$scope.message+")");
		
		Notification.primary({message: "Sending message ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		SlockChainEthContractService.sendMessage($scope.channelId, $rootScope.account, $scope.message).then(function(transaction) {
			$scope.getMessages();
			$rootScope.getBalance();
			$scope.message = "";
			
			Notification.primary({message: "Message sent [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
			$log.debug("[END] CONTROLLER / channelController.sendMessage(channelId="+$scope.channelId,+", account="+$rootScope.account+", message="+$scope.message+") : " + transaction);
			
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / channelController.sendMessage(channelId="+$scope.channelId,+", account="+$rootScope.account+", message="+$scope.message+") : " + error);
		});
	};
})
.controller('aboutController', function ($rootScope, $scope, $log, Notification, init, CommonEthService, VERSION, TIPS_ADDRESS) {
    var crtl = this;
        
    init.then(function(accounts) {
		$log.debug("[START] CONTROLLER / aboutController.init ()");
		
		$scope.version = VERSION;
		$scope.tipsAddress = TIPS_ADDRESS;
		$rootScope.account = accounts[0];
		$rootScope.getBalance();
			
		$log.debug("[END] CONTROLLER / aboutController.init() : account="+$rootScope.account+", channelId=" + $scope.channelId);
    });
	
	$scope.sendTips = function() {
		$log.debug("[START] CONTROLLER / aboutController.sendTips (amount=" + $scope.amount + ")");
		
		Notification.primary({message: "Sending tips ...", delay: null, positionY: 'bottom', positionX: 'right'});
		
		CommonEthService.sendTransaction($rootScope.account, TIPS_ADDRESS, $scope.amount).then(function(transaction) {		
			$rootScope.getBalance();
			
			Notification.primary({message: "Transaction sent [tx: "+transaction+"]", replaceMessage: true, delay: 10000, positionY: 'bottom', positionX: 'right'});
			
			$log.debug("[END] CONTROLLER / aboutController.sendTips (amount=" + $scope.amount + ") : transaction="+transaction);
		
		}, function(error) {
			$log.error("[ERROR] CONTROLLER / aboutController.sendTips (amount=" + $scope.amount + "): " + error);
		});
	}
})

/**
 * RUN
 */
.run(function($rootScope, $log, $filter, Notification, CommonEthService) {
	
	$rootScope.getBalance = function() {
		$log.debug("[START] channelController.getBalance(account="+$rootScope.account+")");
		
		$rootScope.balance = CommonEthService.getBalance($rootScope.account);
		
		$log.debug("[END] CONTROLLER / channelController.getBalance(account="+$rootScope.account+") : " + $rootScope.balance);	
	};
	
	$rootScope.watchLogEvent = function() {
		$log.debug("[START] CONTROLLER / channelController.watchLogEvent()");
		
		$rootScope.contract.SlockChain.Log(function(error, result){
			$log.debug("[DEBUG] CONTROLLER / channelController.watchLogEvent() : error="+error);
			$log.debug("[DEBUG] CONTROLLER / channelController.watchLogEvent() : result="+result);

			if(result != undefined && result.args != undefined) {
				var messageTitle 	= web3.toAscii(result.args.title)
				var messageText 	= web3.toAscii(result.args.text)
				var messageLevel 	= result.args.level.c[0];
				var messageDate 	= new Date(result.args.date.c[0]*1000);
				var messageAddress 	= result.args.sender;

				
				console.log(messageAddress);
				console.log($rootScope.account);
				
				if(messageAddress != $rootScope.account) {
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
});
