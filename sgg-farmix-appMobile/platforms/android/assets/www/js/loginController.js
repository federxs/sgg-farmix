angular.module('starter')
    .controller('LoginController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPlatform, loginService, $localStorage) {
        if ($rootScope.logueado == true) {
            $state.go('app.bienvenido');
        }
        //var usuario = {};
        $rootScope.logueado = false;
        $scope.loginData = {};
        //if (($localStorage.usuario != undefined) && ($localStorage.pass != undefined)) {
        //    usuario.usuario = $localStorage.usuario;
        //    usuario.pass = $localStorage.pass;
        //    showIonicLoading().then(validarLogin).then(function (_login) {
        //        if (_login.resultado == "1") {
        //            $rootScope.logueado = true;
        //            $state.go('app.bienvenido');
        //        } else {
        //            $rootScope.logueado = false;
        //            $scope.loginData = {};
        //            $localStorage.usuario = undefined;
        //            $localStorage.pass = undefined;
        //        }
        //    }).then($ionicLoading.hide).catch($ionicLoading.hide);
        //}
        $scope.doLogin = function () {
            //usuario.usuario = $scope.loginData.usuario;
            //usuario.pass = $scope.loginData.pass;
            showIonicLoading().then(validarLogin).then(function (_login) {
                if (_login.resultado == "1") {
                    $rootScope.logueado = true;
                    $localStorage.usuario = $scope.loginData.usuario;
                    //usuario.usuario = $scope.loginData.usuario;
                    $localStorage.pass = $scope.loginData.pass;
                    //usuario.pass = $scope.loginData.pass;
                    $state.go('app.bienvenido');
                }
                else {
                    $rootScope.logueado = false;
                    alert("Usuario o contraseña incorrecto.");
                }
            }).then($ionicLoading.hide).catch($ionicLoading.hide);
        }
        function validarLogin() {
            $scope.loginData.idRol = 3;
            return loginService.validarLogin($scope.loginData);
        }
        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }
    });