angular.module('starter')
    .controller('BienvenidoController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPlatform, loginService, $localStorage) {
        if (($localStorage.usuario != undefined) && ($localStorage.pass != undefined)) {
            var usuario = {};
            usuario.usuario = $localStorage.usuario;
            usuario.pass = $localStorage.pass;
            alert(usuario.usuario);
            showIonicLoading().then(validarLogin).then(function (_login) {
                if (_login.resultado == "1") {
                    $rootScope.logueado = true;
                    alert("funcion");
                } else {
                    alert("funciona");
                    $rootScope.logueado = false;
                    $localStorage.usuario = undefined;
                    $localStorage.pass = undefined;
                    $state.go('app.login');
                }
            }).then($ionicLoading.hide).catch($ionicLoading.hide);
        } else {
            $rootScope.logueado = false;
        }
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