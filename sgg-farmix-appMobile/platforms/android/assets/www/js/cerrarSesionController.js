angular.module('starter')
    .controller('cerrarSesionController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPlatform, $ionicPopup, $localStorage) {
        if ($rootScope.logueado == false) {
            $state.go('app.login');
        }
        $scope.showConfirm = function () {

            var confirmPopup = $ionicPopup.confirm({

                title: 'Cerrar Sesion',

                template: 'Esta seguro que desea cerrar Sesion?',

            });
            confirmPopup.then(function (res) {
                if (res) {
                    $rootScope.logueado = false;
                    $localStorage.usuario = undefined;
                    $localStorage.pass = undefined;
                    $state.go('app.bienvenido');

                }
            });

        };
    });