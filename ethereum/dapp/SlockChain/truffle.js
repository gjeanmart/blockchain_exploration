module.exports = {
	
  build: {
	  
	/***************************
	 * HTML
	 ***************************/
    "index.html"	: "index.html",
    "channels.html"		: "views/channels.html",
    "channel.html"		: "views/channel.html",

	/***************************
	 * JAVASCRIPT
	 ***************************/
    "lib.js"		: [
		"bower_components/angular/angular.min.js",
		"bower_components/angular-resource/angular-resource.min.js",
		"bower_components/angular-route/angular-route.min.js",
		"bower_components/angular-messages/angular-messages.min.js",
		"bower_components/angular-ui-notification/dist/angular-ui-notification.min.js",
		"bower_components/jquery/dist/jquery.min.js",
		"bower_components/bootstrap/dist/js/bootstrap.min.js"
		//,
		//"bower_components/web3/dist/web3.min.js"
    ],
    "app.js"		: [
		"javascripts/app.js"
    ],
	
	/***************************
	 * CSS
	 ***************************/
    "lib.css"		: [
		"bower_components/bootstrap/dist/css/bootstrap.min.css",
		"bower_components/angular-ui-notification/dist/angular-ui-notification.min.css",
    ],
    "app.css"		: [
		"stylesheets/app.css"
    ],

	/***************************
	 * IMAGES
	 ***************************/
    "images/"		: "images/"
  },
  
  rpc	: {
    host	: "localhost",
    port	: 8545
  },
  
  networks	: {
    "live"		: {
      network_id	: 1, // Ethereum public network
      // optional config values
      // host - defaults to "localhost"
      // port - defaults to 8545
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
    },
    "morden"	: {
      network_id	: 2,        // Official Ethereum test network
      host			: "0.0.0.0",    // Random IP for example purposes (do not use)
      port			: 8545             
    },
    "staging"	: {
      network_id	: 1337 // custom private network
      // use default rpc settings
    },
    "dev"		: {
      network_id	: "default"
    }
  }
};
