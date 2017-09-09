angular.module('starter')
    .controller('ManejoController', function ($ionicLoading, $scope, campoService, rodeoService, $rootScope, registrarEventoService, $state) {
        $rootScope.vacas = [];
        $rootScope.idVacas = [];
        var todosRodeos = {};
        showIonicLoading().then(obtenerCampo).then(function (_campos) {            
            $scope.campos = _campos;
            $scope.evento = {};            
            $scope.evento.campo = "0";                        
        }).then(obtenerRodeo).then(function (_rodeos) {
            todosRodeos = _rodeos;
            $scope.evento.rodeo = "0";
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.cargarRodeo = function () {
            $scope.rodeos = [];
            for (var i = 0; i < todosRodeos.length; i++) {
                if (todosRodeos[i].idCampo == $scope.evento.campo) {
                    $scope.rodeos.push(todosRodeos[i]);
                }
            }
        };
        $scope.registrar = function () {
            if ($scope.evento.campo == "0" || $scope.evento.rodeo == "0") {
                alert("Seleccione un campo y un rodeo para continuar");
            } else {
                if ($rootScope.vacas == undefined) {
                alert("Escanee el tag de al menos una vaca para continuar");
            } else {
                showIonicLoading().then(registrarEvento).then(function () {
                    alert("Evento manejo registrado satisfactoriamente");
                    $rootScope.vacas = [];
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
            var evento = { idTipoEvento: 3, idCampoDestino: $scope.evento.campo, idRodeoDestino: $scope.evento.rodeo };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerCampo() {
            return campoService.getDatosCampo();
        }
        function obtenerRodeo() {
            return rodeoService.getDatosRodeo();
        }
    });