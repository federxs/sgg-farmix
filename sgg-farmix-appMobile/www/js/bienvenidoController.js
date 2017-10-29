angular.module('starter')
    .controller('BienvenidoController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPlatform, loginService, $localStorage) {
        if (($localStorage.usuario != undefined) && ($localStorage.pass != undefined)) {
            var usuario = {};
            usuario.usuario = $localStorage.usuario;
            usuario.pass = $localStorage.pass;
            showIonicLoading().then(validarLogin).then(function (_login) {
                if (_login.resultado == "1") {
                    $rootScope.logueado = true;
                } else {
                    $rootScope.logueado = false;
                    $localStorage.usuario = undefined;
                    $localStorage.pass = undefined;
                }
            }).then($ionicLoading.hide).catch($ionicLoading.hide);
        } else {
            $rootScope.logueado = false;
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