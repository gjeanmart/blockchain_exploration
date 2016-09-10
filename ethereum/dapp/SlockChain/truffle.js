module.exports = {
	
  build: {
	  
	/***************************
	 * HTML
	 ***************************/
    "index.html"		: "index.html",
    "channels.html"		: "views/channels.html",
    "channel.html"		: "views/channel.html",
    "about.html"		: "views/about.html",
    "signup.html"		: "views/signup.html",
    "account.html"		: "views/account.html",
    "error.html"		: "views/error.html",

	/***************************
	 * JAVASCRIPT
	 ***************************/
    "lib.js"		: [
		"bower_components/angular/angular.min.js",
		"bower_components/angular-resource/angular-resource.min.js",
		"bower_components/angular-route/angular-route.min.js",
		"bower_components/angular-messages/angular-messages.min.js",
		"bower_components/angular-ui-notification/dist/angular-ui-notification.min.js",
		"bower_components/angular-ui-router/release/angular-ui-router.min.js",
		"bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
		"bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
		"bower_components/jquery/dist/jquery.min.js",
		"bower_components/bootstrap/dist/js/bootstrap.min.js",
		"bower_components/web3/dist/web3.min.js"
    ],
    "app.js"		: [
		"javascripts/app.js"
    ],
	
	/***************************
	 * CSS
	 ***************************/
    "lib.css"		: [
		"bower_components/bootstrap/dist/css/bootstrap.min.css",
		"bower_components/angular-bootstrap/ui-bootstrap-csp.css",
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
  }

};
