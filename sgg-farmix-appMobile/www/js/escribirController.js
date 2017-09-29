angular.module('starter')
    .controller('EscribirController', function ($scope, $rootScope, $ionicLoading, bovinoService) {
        showIonicLoading().then(getBovinos).then(function (_bovinos) {
            $scope.bovinosEscritos = [];
            for (var i = 0; i < _bovinos.length; i++) {
                if (_bovinos[i].escrito) {
                    $scope.bovinosEscritos.push(_bovinos[i]);
                } else {
                    $scope.bovinos.push(_bovinos[i]);
                }
            }
        }).then($ionicLoading.hide).catch($ionicLoading.hide);

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }
        function getBovinos() {
            return bovinoService.getBovinos();
        }

        $scope.grabar = function (id) {
            $rootScope.idEscribir = id;
            $state.go('app.escribirTag');
        }
    })