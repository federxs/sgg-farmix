angular.module('starter')
    .controller('AntibioticoController', function ($ionicLoading, $scope, antibioticoService, $rootScope, registrarEventoService, $state) {
        showIonicLoading().then(obtenerAntibiotico).then(function (_antibioticos) {            
            $scope.antibioticos = _antibioticos;
            $scope.evento = {};
            $scope.txtMiligramaje = {};
            $scope.evento.antibiotico = "0";
            
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if($scope.txtMiligramaje.value > 0){
            if ($scope.evento.antibiotico == "0") {
                alert("Seleccione un antibiótico para continuar");
            } else {
                if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                alert("Escanee el tag de al menos una vaca para continuar");
            } else {
                showIonicLoading().then(registrarEvento).then(function () {
                    alert("Antibiótico registrado satisfactoriamente");
                    $rootScope.vacas = null;
                    $rootScope.idVacas = [];
                    $state.go('app.registrarEvento');
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
            }
          }            
        } else{
            alert("Ingrese una cantidad de miligramos valida.");
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarEvento() {
            var evento = { idTipoEvento: 2, idAntibiotico: $scope.evento.antibiotico, cantidad: $scope.txtMiligramaje.value };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerAntibiotico() {
            return antibioticoService.getDatosAntibiotico();
        }
    });