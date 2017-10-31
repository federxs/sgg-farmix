angular.module('starter')
.controller('RegistrarEventoController', function ($scope,$rootScope, $state) {
    if($rootScope.logueado == false){
       $state.go('app.bienvenido');
    }
    $scope.vacunar = function () {
        $state.go('app.vacunacion');
    }
    $scope.manejar = function () {
        $state.go('app.manejo');
    }
    $scope.antibiotico = function () {
        $state.go('app.antibiotico');
    }
    $scope.alimento = function () {
        $state.go('app.alimento');
    }
});