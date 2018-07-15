angular.module('starter')
    .controller('RegistrarNacimientoController', function ($scope, $rootScope, nacimientoService, $ionicLoading, $state, $localStorage) {
        if ($rootScope.logueado == false) {
            $state.go('app.bienvenido');
        }

        $scope.registrar = function () {
            if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                alert("Escanee el tag de al menos una vaca para continuar");
            } else {
                showIonicLoading().then(registrarNacimiento).then(function () {
                    alert("Nacimiento registrado con \u00E9xito");
                    $rootScope.vacas = null;
                    $rootScope.idVacas = [];
                    $rootScope.toros = null;
                    $rootScope.idToros = [];
                    $state.go('app.inseminacionMenu');
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
            }
        };

        $scope.quitar = function (caravana) {
            for (var i = 0; i < $rootScope.vacas.length; i++) {
                if ($rootScope.vacas[i].numCaravana == caravana) {
                    $rootScope.idVacas.splice(i, 1);
                    $rootScope.vacas.splice(i, 1);
                    return;
                }
            }
        };

        $scope.quitarToro = function () {
            $rootScope.idToros.splice(0, 1);
            $rootScope.toros.splice(i, 1);
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarNacimiento() {
            var date = new Date();
            var formattedDate = moment(date).format('YYYYMMDD');
            var toro = '';
            if ($rootScope.idToros != undefined) {
                toro = $rootScope.idToros[0]
            }
            return nacimientoService.registrarNacimiento($rootScope.idVacas, formattedDate, toro, $localStorage.campo);
        }
    });