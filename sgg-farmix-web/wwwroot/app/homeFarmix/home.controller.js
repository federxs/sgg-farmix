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
            });
        }
        $scope.load();
    });
})();
