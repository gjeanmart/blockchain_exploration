module.exports = {
  build: {
	/* HTML */
    "index.html"			: "index.html",
    "views/home.html"		: "components/home/home.html",
    "views/error.html"		: "components/error/error.html",
    "views/pot-list.html"	: "components/pot/pot-list.html",
    "views/pot-create.html"	: "components/pot/pot-create.html",
    "views/pot.html"		: "components/pot/pot.html",
    "views/modal-alert.html": "common/views/modal-alert.html",
	
	/* JAVASCRIPT */
    "lib.js": [
		"assets/libs/bower_components/angular/angular.min.js",
		"assets/libs/bower_components/angular-resource/angular-resource.min.js",
		"assets/libs/bower_components/angular-route/angular-route.min.js",
		"assets/libs/bower_components/angular-messages/angular-messages.min.js",
		"assets/libs/bower_components/angular-ui-notification/dist/angular-ui-notification.min.js",
		"assets/libs/bower_components/angular-ui-router/release/angular-ui-router.min.js",
		"assets/libs/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
		"assets/libs/bower_components/angular-bootstrap-show-errors/src/showErrors.min.js",
		"assets/libs/bower_components/angular-clipboard/angular-clipboard.js",
		//"assets/libs/bower_components/angular-gravatar/build/angular-gravatar.min.js",
		"assets/libs/angular-gravatar.greg.js",
		"assets/libs/bower_components/jquery/dist/jquery.min.js",
		"assets/libs/bower_components/bootstrap/dist/js/bootstrap.min.js",
		"assets/libs/bower_components/web3/dist/web3.min.js",
		"assets/libs/bower_components/sprintf/dist/angular-sprintf.min.js",
		"assets/libs/bower_components/sprintf/dist/sprintf.min.js",
		"assets/libs/bower_components/ng-table/dist/ng-table.min.js",
		"assets/libs/bower_components/js-sha3/build/sha3.min.js"
    ],
    "app.js"	: [
		"app.js",
		"config.js",
		"routes.js",
		"run.js",
		
		// Common Services
		"common/services/common.js",
		"common/services/ethereum.js",
		"common/services/Pot.js",
		"common/services/PotRegistry.js",
		"common/services/currency-converter.js",
		
		// Common directives
		"common/directives/back.js",
		"common/directives/ethAddress.js",
	  
		// Common factories
		"common/factories/init.js",
	  
		// Controllers
		"common/controller/modal-alert-controller.js",
		"components/home/home-controller.js",
		"components/error/error-controller.js",
		"components/pot/pot-list-controller.js",
		"components/pot/pot-create-controller.js",
		"components/pot/pot-details-controller.js"
    ],
	
	/* CSS */
    "lib.css"	: [
		"assets/libs/bower_components/bootstrap/dist/css/bootstrap.min.css",
		"assets/libs/bower_components/angular-bootstrap/ui-bootstrap-csp.css",
		"assets/libs/bower_components/angular-ui-notification/dist/angular-ui-notification.min.css",
		"assets/libs/bower_components/font-awesome/css/font-awesome.min.css",
		"assets/libs/bower_components/ng-table/dist/ng-table.min.css",
		"assets/libs/bower_components/bootstrap-social/bootstrap-social.css"
    ],
    "app.css"	: [
		"assets/css/app.css"
    ],
	
	/* IMAGES */
    "images/"	: "assets/images/",
	
	/* FONTS */
    "fonts/"	: "assets/libs/bower_components/bootstrap/fonts/",
    //"fonts/"	: "assets/libs/bower_components/font-awesome/fonts/",

  },
  
  
  /* RPC */
  rpc	: {
	host	: "localhost",
	port	: 8545
  }
};
