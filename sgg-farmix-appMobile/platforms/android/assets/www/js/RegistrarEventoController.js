angular.module('starter')
.controller('RegistrarEventoController', function ($scope, $state) {
    $scope.vacunar = function () {
        $state.go('app.vacunacion');
    }
    $scope.manejar = function () {
        $state.go('app.manejo');
    }
    $scope.antibiotico = function () {
        $state.go('app.antibiotico');
    }
});