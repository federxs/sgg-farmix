(function () {
    'use strict';

    angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/masterPage");

        /// Default
        $stateProvider.state('masterPage', {
            url: "/masterPage",
            templateUrl: "app/masterPage.html"
            //data: {
            //    pageTitle: "LOGIN",
            //    bodyClass: "login"
            //},
            //controller: "loginController",
            //resolve: {
            //    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([{
            //            name: 'MetronicApp',
            //            insertBefore: '#ng_load_plugins_before',
            //            files: [
			//		 'assets/pages/css/login.min.css',
			//		 'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
			//		 'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
			//		 'assets/global/scripts/app.min.js',
			//		 'assets/pages/scripts/login.min.js',
			//		 'scripts/services/portal/login-service.js',
			//		 'scripts/controllers/portal/login-controller.js'
            //            ]
            //        }]);
            //    }]
            //}
        });
    })
})();