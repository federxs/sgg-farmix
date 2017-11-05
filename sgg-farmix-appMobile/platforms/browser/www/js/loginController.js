angular.module('starter')
    .controller('LoginController', function ($scope, $rootScope, $state, $ionicLoading, $ionicPlatform, loginService, $localStorage) {
        if ($rootScope.logueado == true) {
            $state.go('app.bienvenido');
        }
        $rootScope.logueado = false;
        $scope.loginData = {};        
        $scope.doLogin = function () {
            if (($scope.loginData.usuario === undefined || $scope.loginData.usuario === "") || ($scope.loginData.pass === undefined || $scope.loginData.pass === "")) {
                alert("El usuario y la contrase\u00F1a no pueden estar vac\u00edos.");
            } else {
                showIonicLoading().then(validarLogin).then(function (_login) {
                    if (_login.resultado == "1") {
                        $rootScope.logueado = true;
                        $localStorage.usuario = $scope.loginData.usuario;
                        $localStorage.pass = $scope.loginData.pass;
                        $localStorage.campo = _login.codigoCampo;
                        $state.go('app.bienvenido');
                    }
                    else {
                        $rootScope.logueado = false;
                        alert("Usuario o contrase\u00F1a incorrecto.");
                    }
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
            }
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