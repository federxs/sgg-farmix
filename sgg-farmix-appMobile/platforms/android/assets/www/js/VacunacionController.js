angular.module('starter')
    .controller('VacunacionController', function ($ionicLoading, $scope, vacunaService, $rootScope, registrarEventoService, $state, $localStorage) {
        showIonicLoading().then(obtenerVacuna).then(function (_vacunas) {
            if ($rootScope.logueado == false) {
                $state.go('app.bienvenido');
            }
            $scope.vacunas = _vacunas;
            $scope.evento = {};
            $scope.txtMiligramaje = {};
            $scope.evento.vacuna = "0";

        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if ($scope.txtMiligramaje.value > 0) {
                if ($scope.evento.vacuna == "0") {
                    alert("Seleccione una vacuna para continuar");
                } else {
                    if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                        alert("Escanee el tag de al menos una vaca para continuar");
                    } else {
                        showIonicLoading().then(registrarEvento).then(function () {
                            alert("Vacunacion registrada satisfactoriamente");
                            $rootScope.vacas = null;
                            $rootScope.idVacas = [];
                            $state.go('app.registrarEvento');
                        }).then($ionicLoading.hide).catch($ionicLoading.hide);
                    }
                }
            } else {
                alert("Ingrese una cantidad de miligramos valida.");
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarEvento() {
            var evento = { idTipoEvento: 1, idVacuna: $scope.evento.vacuna, cantidad: $scope.txtMiligramaje.value };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerVacuna() {
            return vacunaService.getDatosVacuna($localStorage.campo);
        }
    });