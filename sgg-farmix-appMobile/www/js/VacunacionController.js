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
                            alert("Vacunaci\u00F3n registrada con \u00E9xito");
                            $rootScope.vacas = null;
                            $rootScope.idVacas = [];
                            $state.go('app.registrarEvento');
                        }).then($ionicLoading.hide).catch($ionicLoading.hide);
                    }
                }
            } else {
                alert("Ingrese una cantidad de miligramos v\u00E1lida.");
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarEvento() {
            var date = new Date();
            var formattedDate = moment(date).format('YYYYMMDDHHmmss');
            var evento = { idTipoEvento: 1, idVacuna: $scope.evento.vacuna, cantidad: $scope.txtMiligramaje.value, fechaHora: formattedDate };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerVacuna() {
            return vacunaService.getDatosVacuna($localStorage.campo);
        }
    });