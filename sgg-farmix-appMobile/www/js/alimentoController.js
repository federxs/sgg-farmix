angular.module('starter')
    .controller('AlimentoController', function ($ionicLoading, $scope, alimentoService, $rootScope, registrarEventoService, $state) {
        showIonicLoading().then(obtenerAlimento).then(function (_alimentos) {            
            if($rootScope.logueado == false){
            $state.go('app.bienvenido');
            }
            $scope.alimentos = _alimentos;
            $scope.evento = {};
            $scope.txtKiligramaje = {};
            $scope.evento.alimento = "0";
            
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        $scope.registrar = function () {
            if($scope.txtKiligramaje.value > 0){
            if ($scope.evento.alimento == "0") {
                alert("Seleccione un alimento para continuar");
            } else {
                if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                alert("Escanee el tag de al menos una vaca para continuar");
            } else {
                showIonicLoading().then(registrarEvento).then(function () {
                    alert("Alimento registrado satisfactoriamente");
                    $rootScope.vacas = null;
                    $rootScope.idVacas = [];
                    $state.go('app.registrarEvento');
                }).then($ionicLoading.hide).catch($ionicLoading.hide);
            }
          }            
        } else{
            alert("Ingrese una cantidad de kilogramos valida.");
            }
        };

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function registrarEvento() {
            var evento = { idTipoEvento: 4, idAlimento: $scope.evento.alimento, cantidad: $scope.txtKiligramaje.value };
            return registrarEventoService.registrarEvento(evento);
        }

        function obtenerAlimento() {
            return alimentoService.getDatosAlimento();
        }
    });