(function () {
    'use strict';

    angular.module('app').controller('homeController', function (
        $scope,
        homeService,
        $state,
        toastr
        ) {
        $scope.Menu = [];

        $scope.load = function () {
            $scope.showSpinner = true;
            homeService.getListMenu({}, function (data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                if (path === 'home.undefined')
                    $state.go('home.inicio');
                $scope.Menu = data;
                for (var i = 0; i < $scope.Menu.length; i++) {
                    if ($scope.Menu[i].urlMenu === path)
                        $scope.Menu[i].activo = 'background-color:#E59866';
                    else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                        for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                            $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                        }
                    }
                    else
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                }
            }, function (error) {
                $scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
        $scope.load();

        $scope.desactivarMenuHijos = function (menu) {
            var index = $scope.Menu.indexOf(menu);
            for (var i = 0; i < $scope.Menu[index].menu_Hijos.length; i++) {
                $scope.Menu[index].menu_Hijos[i].activo = 'background-color:#FAE5D3';
            }
        }

        $scope.activar = function (id) {
            for (var i = 0; i < $scope.Menu.length; i++) {
                if ($scope.Menu[i].idMenu === id)
                    $scope.Menu[i].activo = 'background-color:#E59866';
                else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                    for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                        if ($scope.Menu[i].menu_Hijos[j].idMenu === id)
                            $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#E59866';
                        else
                            $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                    }
                }
                else
                    $scope.Menu[i].activo = 'background-color:#FAE5D3';
            }
        };
    });
})();
