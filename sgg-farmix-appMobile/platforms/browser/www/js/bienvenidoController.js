angular.module('starter')
    .controller('BienvenidoController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPlatform, loginService, $localStorage, conexion, alimentoService) {
        if (!$rootScope.logueado) { 
            if (($localStorage.usuario != undefined) && ($localStorage.pass != undefined)) {
                alert("bienvenido" + conexion.online());
                if(conexion.online()){
                    var usuario = {};
                    usuario.usuario = $localStorage.usuario;
                    usuario.pass = $localStorage.pass;
                    showIonicLoading().then(validarLogin).then(function (_login) {
                        if (_login.resultado == "1") {
                            $rootScope.logueado = true;
                            //hay conexion
                            if (!$localStorage.ultimaConConexion) {
                                //si la ultima vez fue sin conexion, realizar post
                                //tirar a los services que hagan el post
                            }
                            alimentoService.getDatosAlimento($localStorage.campo);
                        } else {
                            $rootScope.logueado = false;
                            $localStorage.usuario = undefined;
                            $localStorage.pass = undefined;
                            $state.go('app.login');
                        }
                    }).then($ionicLoading.hide).catch($ionicLoading.hide);
                } else {
                    $rootScope.logueado = true;
                }
            } else {
                $rootScope.logueado = false;
            }
        } else {
            //hay conexion
            if (!$localStorage.ultimaConConexion) {
                //si la ultima vez fue sin conexion, realizar post
                //tirar a los services que hagan el post
            }
            alimentoService.getDatosAlimento($localStorage.campo);
        };
        $scope.iniciar = function() {
            $state.go('app.login');
        }
        function validarLogin() {
            usuario.idRol = 3;
            return loginService.validarLogin(usuario);
        }
        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }
    });