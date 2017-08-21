angular.module('starter')
.controller('RegistrarEventoController', function ($scope, $state) {
    $scope.vacunar = function () {
        $state.go('app.vacunacion');

    }
});