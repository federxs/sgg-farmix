(function () {
    'use strict';

    angular.module('app').controller('homeController', function (
        $scope,
        homeService
        ) {
        $scope.Menu = [];

        $scope.load = function () {
            homeService.getListMenu({},function (data) {
                $scope.Menu = data;
                for (var i = 0; i < $scope.Menu.length; i++) {
                    $scope.Menu[i].activo = 'background-color:#1B95CC';
                }
            });
        }
        $scope.load();

        $scope.activar = function (id) {
            for (var i = 0; i < $scope.Menu.length; i++) {
                if ($scope.Menu[i].idMenu === id)
                    $scope.Menu[i].activo = 'background-color:#083AF2'
                else
                    $scope.Menu[i].activo = 'background-color:#1B95CC';
            }
        }
    });
})();
