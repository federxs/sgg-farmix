﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleUsuariosController', detalleUsuariosController);

    detalleUsuariosController.$inject = ['$scope', 'detalleUsuariosService', '$stateParams', 'toastr'];

    function detalleUsuariosController($scope, detalleUsuariosService, $stateParams, toastr) {
        var vm = $scope;
        //variables

        //metodos
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            detalleUsuariosService.getUsuario($stateParams.id).then(function success(data) {
                vm.usuario = data;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }
    }
})();
