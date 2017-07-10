﻿(function () {
    'use strict';

    angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");

        /// Default
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/master.html',
                controller: 'homeController',
                data: {
                    pageTitle: 'Farmix - Home',
                    bodyClass: 'master'
                }
            });
        $stateProvider
            .state('home.registrarBovino', {
                url: '/bovinos/registrar',
                templateUrl: 'app/bovino/registrar-bovino/registrar-bovino.html',
                controller: 'registrarBovinoController',
                data: {
                    pageTitle: 'Farmix - Registrar Bovino'
                }
            });
        $stateProvider
        .state('home.consultarBovino', {
            url: '/bovinos',
            templateUrl: 'app/bovino/consultar-bovino/consultar-bovino.html',
            controller: 'consultarBovinoController',
            data: {
                pageTitle: 'Farmix - Consulta de Bovinos'
            }
        });
        $stateProvider
        .state('home.detalleBovino', {
            url: '/bovinos/:id/detalle',
            params: { 'id': null },
            templateUrl: 'app/bovino/detalle-bovino/detalle-bovino.html',
            controller: 'detalleBovinoController',
            data: {
                pageTitle: 'Farmix - Detalle de Bovino'
            }
        });
        $stateProvider
        .state('home.modificarBovino', {
            url: '/bovinos/:id/modificacion',
            params: {'id': null},
            templateUrl: 'app/bovino/modificar-bovino/modificar-bovino.html',
            controller: 'modificarBovinoController',
            data: {
                pageTitle: 'Farmix - Modificación de Bovino'
            }
        });
        $stateProvider
        .state('home.eliminarBovino', {
            url: '/bovinos/:id/darDeBaja',
            templateUrl: 'app/bovino/eliminar-bovino/eliminar-bovino.html',
            controller: 'eliminarBovinoController'
        });
    });
})();

//,
//controller: "loginController",
//resolve: {
//    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//        return $ocLazyLoad.load([{
//            name: 'app',
//            insertBefore: '#ng_load_plugins_before',
//            files: [
//		 //'assets/pages/css/login.min.css',
//		 //'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
//		 //'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
//		 //'assets/global/scripts/app.min.js',
//		 //'assets/pages/scripts/login.min.js',
//		 //'scripts/services/portal/login-service.js',
//		 //'scripts/controllers/portal/login-controller.js'
//            ]
//        }]);
//    }]
//}