angular.module('starter')
    .controller('InseminacionesPendientesController', function ($scope, $state, inseminacionService, $ionicLoading) {
        function cargarInseminacionesPendientes() {
            showIonicLoading().then(getInseminacionesPendientes).then(function (_inseminaciones) {
                $scope.inseminaciones = _inseminaciones;
            }).then($ionicLoading.hide).catch($ionicLoading.hide);
        }

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }
        function getInseminacionesPendientes() {
            return inseminacionService.getInseminacionesPendientes();
        }

        $scope.verificar = function (idInseminacion) {
            $state.go('app.verificarInseminacion', { idInseminacion: idInseminacion });
        }
        $scope.cargarInseminacionesPendientes = cargarInseminacionesPendientes;
        
        cargarInseminacionesPendientes();
    });