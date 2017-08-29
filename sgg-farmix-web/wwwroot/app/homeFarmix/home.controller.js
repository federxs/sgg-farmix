(function () {
    'use strict';

    angular.module('app').controller('homeController', function (
        $scope,
        homeService,
        $state
        ) {
        $scope.Menu = [];

        $scope.load = function () {
            homeService.getListMenu({}, function (data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                if (path === 'home.undefined')
                    $state.go('home.inicio');
                $scope.Menu = data;
                for (var i = 0; i < $scope.Menu.length; i++) {
                    if ($scope.Menu[i].urlMenu === path)
                        $scope.Menu[i].activo = 'background-color:#E59866';
                    else
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                }               
            }, function (error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }
        $scope.load();

        $scope.activar = function (id) {
            for (var i = 0; i < $scope.Menu.length; i++) {
                if ($scope.Menu[i].idMenu === id)
                    $scope.Menu[i].activo = 'background-color:#E59866';
                else
                    $scope.Menu[i].activo = 'background-color:#FAE5D3';
            }
        }
    });
})();
