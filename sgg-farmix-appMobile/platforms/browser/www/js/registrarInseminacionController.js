angular.module('starter')
    .controller('RegistrarInseminacionController', function ($scope, $rootScope, inseminacionService, $ionicLoading, $state, $localStorage) {
        if($rootScope.logueado == false){
            $state.go('app.bienvenido');
        }
        $rootScope.evento = {};
        $rootScope.evento.tipoInseminacion = "0";

        $scope.registrar = function () {
            if ($rootScope.evento.tipoInseminacion == "0") {
                alert("Seleccione un tipo de inseminaci\u00f3n");
            } else {
                if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                    alert("Escanee el tag de al menos una vaca para continuar");
                } else {
                    if ($rootScope.evento.tipoInseminacion == "2" && ($rootScope.toros == null || $rootScope.toros == undefined)) {
                        alert("Para la inseminaci\u00F3n por montura, escanee el tag de al menos un toro para continuar");
                    } else {
                        showIonicLoading().then(registrarInseminacion).then(function () {
                            alert("Inseminaci\u00F3n registrada con \u00E9xito");
                            $rootScope.vacas = null;
                            $rootScope.idVacas = [];
                            $rootScope.toros = null;
                            $rootScope.idToros = [];
                            $rootScope.evento.tipoInseminacion = "0";
                            $state.go('app.inseminacionMenu');
                        }).then($ionicLoading.hide).catch($ionicLoading.hide);
                    }
                }
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarInseminacion()
        {
            var date = new Date();
            var formattedDate = moment(date).format('YYYYMMDD');
            var inseminacion = { tipoInseminacion: $rootScope.evento.tipoInseminacion.toString(), fechaInseminacion: formattedDate };
            return inseminacionService.registrarInseminacion(inseminacion, $localStorage.campo);
        }
    });