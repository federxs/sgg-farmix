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
                    $state.go('app.inseminacionMenu');
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
            }
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