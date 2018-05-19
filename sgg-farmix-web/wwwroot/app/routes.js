(function () {
    'use strict';

    angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");

        /// Default
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'loginController'
            });
        $stateProvider
            .state('seleccionCampo', {
                url: '/login/seleccion-campo',
                templateUrl: 'app/seleccion-campo/seleccion-campo.html',
                controller: 'seleccionCampoController'
            });
        $stateProvider
            .state('registrarCampo', {
                url: '/registrarCampo',
                templateUrl: 'app/campo/registrar-campo.html',
                controller: 'registrarCampoController'
            });
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
             .state('home.inicio', {
                 url: '/inicio',
                 templateUrl: 'app/inicio/inicio.html',
                 controller: 'inicioController',
                 data: {
                     pageTitle: 'Farmix - Inicio'
                 }
             });
        $stateProvider
            .state('home.consultarConflicto', {
                url: '/conflicto',
                templateUrl: 'app/conflicto/consultar-conflicto/consultar-conflicto.html',
                controller: 'consultarConflictoController'
            })
        //$stateProvider
            .state('home.resolverConflicto', {
                url: '/conflicto/resolver',
                params: { 'idEvento': null, 'idEventoConfl': null, 'idInseminacion': null, 'idInseminConfl': null },
                templateUrl: 'app/conflicto/resolver-conflicto/resolver-conflicto.html',
                controller: 'resolverConflictoController'
            });
        $stateProvider
            .state('home.bovino', {
                url: '/bovino',
                templateUrl: 'app/bovino/consultar-bovino/consultar-bovino.html',
                controller: 'consultarBovinoController',
                data: {
                    pageTitle: 'Farmix - Consulta de Bovinos'
                }
            })
        //$stateProvider
            .state('home.registrarBovino', {
                url: '/bovino/registrar',
                templateUrl: 'app/bovino/registrar-bovino/registrar-bovino.html',
                controller: 'registrarBovinoController',
                data: {
                    pageTitle: 'Farmix - Registrar Bovino'
                }
            })
        //$stateProvider
            .state('home.detalleBovino', {
                url: '/bovino/detalle',
                params: { 'id': null, 'evento': null , 'proviene': null, 'fecha': null, 'desde': null },
                templateUrl: 'app/bovino/detalle-bovino/detalle-bovino.html',
                controller: 'detalleBovinoController',
                data: {
                    pageTitle: 'Farmix - Detalle de Bovino'
                }
            })
        //$stateProvider
            .state('home.modificarBovino', {
                url: '/bovino/modificacion',
                params: { 'id': null },
                templateUrl: 'app/bovino/modificar-bovino/modificar-bovino.html',
                controller: 'modificarBovinoController',
                data: {
                    pageTitle: 'Farmix - Modificación de Bovino'
                }
            })
        //$stateProvider
            .state('home.eliminarBovino', {
                url: '/bovino/darDeBaja',
                params: { 'id': null },
                templateUrl: 'app/bovino/eliminar-bovino/eliminar-bovino.html',
                controller: 'eliminarBovinoController'
            });
        $stateProvider
            .state('home.trazabilidad', {
                url: '/trazabilidad',
                templateUrl: 'app/trazabilidad/consultar-trazabilidad/consultar-trazabilidad.html',
                controller: 'consultarTrazabilidadController',
                data: {
                    pageTitle: 'Farmix - Consulta Trazabilidad'
                }
            })
            .state('home.detalleEvento', {
                url: '/evento/detalle',
                params: { 'id': null },
                templateUrl: 'app/trazabilidad/detalle-evento/detalle-evento.html',
                controller: 'detalleEventoController'
            })
            .state('home.modificarEvento', {
                url: '/evento/modificar',
                params: { 'id': null },
                templateUrl: 'app/trazabilidad/modificar-evento/modificar-evento.html',
                controller: 'modificarEventoController'
            });
        $stateProvider
            .state('home.inseminacion', {
                url: '/inseminacion',
                templateUrl: 'app/inseminacion/consultar-inseminacion/consultar-inseminacion.html',
                controller: 'consultarInseminacionController'
            })
            .state('home.modificarInseminacion', {
                url: '/inseminacion/modificar',
                params: { 'fecha': null, 'desde': null },
                templateUrl: 'app/inseminacion/modificar-inseminacion/modificar-inseminacion.html',
                controller: 'modificarInseminacionController'
            })
            .state('home.detalleInseminacion', {
                url: '/inseminacion/detalle',
                params: { 'fecha': null, 'desde': null },
                templateUrl: 'app/inseminacion/detalle-inseminacion/detalle-inseminacion.html',
                controller: 'detalleInseminacionController'
            });
        $stateProvider
            .state('home.usuarios', {
                url: '/usuarios',
                templateUrl: 'app/usuarios/consultar-usuarios/consultar-usuarios.html',
                controller: 'consultarUsuariosController'
            })
            .state('home.modificarUsuario', {
                url: '/usuarios/modificacion',
                params: { 'id': null },
                templateUrl: 'app/usuarios/modificar-usuarios/modificar-usuarios.html',
                controller: 'modificarUsuariosController'
            })
            .state('home.detalleUsuario', {
                url: '/usuarios/detalle',
                params: { 'id': null },
                templateUrl: 'app/usuarios/detalle-usuarios/detalle-usuarios.html',
                controller: 'detalleUsuariosController'
            })
            .state('home.registrarUsuario', {
                url: '/usuarios/registro',
                templateUrl: 'app/usuarios/registrar-usuarios/registrar-usuarios.html',
                controller: 'registrarUsuariosController'
            });
        $stateProvider
            .state('home.configuracion', {
                url: '/configuracion',
                templateUrl: 'app/configuracion/configuracion.html',
                controller: 'configuracionController'
            })
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