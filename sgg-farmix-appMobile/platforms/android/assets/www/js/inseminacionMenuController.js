angular.module('starter')
.controller('InseminacionMenuController', function ($scope, $state) {
    $scope.inseminar = function () {
        $state.go('app.inseminacion');
    }
    $scope.ecografia = function () {
        $state.go('app.ecografia');
    }
    $scope.tacto = function () {
        $state.go('app.tacto');
    }
});