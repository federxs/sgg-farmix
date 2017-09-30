angular.module('starter')
    .controller('InseminacionController', function ($scope, $rootScope, inseminacionService) {
        $rootScope.tipoInseminacion = "0";

        $scope.registrar = function () {
            if ($scope.tipoInseminacion == "0") {
                alert("Seleccione un tipo de inseminación");
            } else {
                if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                    alert("Escanee el tag de al menos una vaca para continuar");
                } else {
                    if ($scope.tipoInseminacion == "2" && ($rootScope.toros == null || $rootScope.toros == undefined)) {
                        alert("Para la inseminación por montura escanee el tag de al menos un toro para continuar");
                    } else {
                        showIonicLoading().then(registrarInseminacion).then(function () {
                            alert("Inseminacion registrada satisfactoriamente");
                            $rootScope.vacas = null;
                            $rootScope.idVacas = [];
                            $rootScope.toros = null;
                            $rootScope.idToros = [];
                            $rootScope.tipoInseminacion = "0";
                            $state.go('app.inseminacionMenu');
                        }).then($ionicLoading.hide).catch($ionicLoading.hide);
                    }
                }
            }
        };

        function registrarInseminacion()
        {
            var inseminacion = { tipoInseminacion: $rootScope.tipoInseminacion };
            return inseminacionService.registrarInseminacion(inseminacion);
        }
    });