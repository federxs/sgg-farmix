angular.module('starter')
    .controller('ManejoController', function ($ionicLoading, $scope, rodeoService, $rootScope, registrarEventoService, $state, $localStorage) {
        if ($rootScope.logueado == false) {
            $state.go('app.bienvenido');
        }

        showIonicLoading().then(obtenerRodeos).then(function (_rodeos) {
            $scope.rodeos = _rodeos;
            $scope.evento = {};
            $scope.evento.rodeo = "0";
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if ($scope.evento.rodeo == "0") {
                alert("Seleccione un rodeo para continuar");
            } else {
                if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                    alert("Escanee el tag de al menos una vaca para continuar");
                } else {
                    showIonicLoading().then(registrarEvento).then(function () {
                        alert("Evento manejo registrado con \u00E9xito");
                        $rootScope.vacas = null;
                        $rootScope.idVacas = [];
                        $state.go('app.registrarEvento');
                    }).then($ionicLoading.hide).catch($ionicLoading.hide);
                }
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
            var evento = { idTipoEvento: 3, idCampoDestino: $localStorage.campo, idRodeoDestino: $scope.evento.rodeo, fechaHora: formattedDate };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerRodeos() {
            console.log("obtenemos rodeos");
            var rodeos = rodeoService.getDatosRodeo($localStorage.campo);
            console.log(rodeos);
            return rodeos;
        }
    });