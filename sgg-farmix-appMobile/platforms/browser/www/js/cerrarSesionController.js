angular.module('starter')
    .controller('cerrarSesionController', function ($scope, $rootScope, $state, $localStorage, $ionicHistory) {
        if ($rootScope.logueado == false) {
            $state.go('app.login');
        }
        $scope.aceptar = function () {
                    $rootScope.logueado = false;
                    $localStorage.usuario = undefined;
                    $localStorage.pass = undefined;
                    $state.go('app.bienvenido');
        };
        $scope.cancelar = function () {            
            $state.go('app.bienvenido');
        };
    });