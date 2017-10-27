angular.module('starter')
.controller('InseminacionMenuController', function ($scope, $state) {
    $scope.inseminar = function () {
        $state.go('app.registrarInseminacion');
    }
    $scope.verificarInseminacion = function () {
        $state.go('app.inseminacionesPendientes');
    }
});