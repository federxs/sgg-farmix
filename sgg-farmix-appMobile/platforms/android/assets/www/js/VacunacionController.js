angular.module('starter')
    .controller('VacunacionController', function ($ionicLoading, $scope, vacunaService, $rootScope, registrarEventoService, $state) {
        showIonicLoading().then(obtenerVacuna).then(function (_vacunas) {
            $scope.vacunas = _vacunas;
            $scope.evento = {};
            $scope.txtMiligramaje = {};
            $rootScope.idVacas = [];
            $rootScope.idVacas.push(8);
            $rootScope.idVacas.push(9);
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if ($rootScope.vacas == undefined) {
                alert("Escanee el tag de al menos una vaca para continuar");
            } else {
                showIonicLoading().then(registrarEvento).then(function () {
                    alert("Vacunacion registrada satisfactoriamente");
                    $rootScope.vacas = [];
                    $state.go('app.registrarEvento');
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
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
            return vacunaService.getDatosVacuna();
        }
    });