angular.module('starter')
    .controller('EscribirController', function ($scope, $rootScope, $ionicLoading, bovinoService, $state, $localStorage) {
        if($rootScope.logueado == false){
            $state.go('app.bienvenido');
        }
        function cargarBovinos() {
            showIonicLoading().then(getBovinos).then(function (_bovinos) {
                $scope.bovinosEscritos = [];
                $scope.bovinos = [];
                for (var i = 0; i < _bovinos.length; i++) {
                    if (_bovinos[i].escrito) {
                        $scope.bovinosEscritos.push(_bovinos[i]);
                    } else {
                        $scope.bovinos.push(_bovinos[i]);
                    }
                }
            }).then($ionicLoading.hide).catch($ionicLoading.hide);
        }

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }
        function getBovinos() {
            return bovinoService.getBovinos($localStorage.campo);
        }

        $scope.grabar = function (id, escribir) {
            $rootScope.actualizarEscritura = escribir;
            $rootScope.idEscribir = id;
            $state.go('app.escribirTag');
        }

        $scope.cargarBovinos = cargarBovinos;

        cargarBovinos();
    })