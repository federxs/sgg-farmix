angular.module('starter')
.controller('InseminacionMenuController', function ($scope, $state) {
    if ($rootScope.logueado == false) {
        $state.go('app.bienvenido');
    }
    $scope.inseminar = function () {
        $state.go('app.registrarInseminacion');
    }
    $scope.verificarInseminacion = function () {
        $state.go('app.inseminacionesPendientes');
    }
});