(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleInseminacionController', detalleInseminacionController);

    detalleInseminacionController.$inject = ['$scope', 'detalleInseminacionService', '$stateParams', 'toastr'];

    function detalleInseminacionController($scope, detalleInseminacionService, $stateParams, toastr) {
        var vm = $scope;
        //variables
        vm.inseminacion = {};
        vm.desde = $stateParams.desde;
        vm.itemsPorPaginaTacto = 10;
        vm.showSpinner = true;
        vm.disabled = true;
        //funciones
        vm.inicializar = inicializar();


        function inicializar() {
            vm.showSpinner = true;
            vm.disabled = true;
            vm.itemsPorPagina = 9;
            if ($stateParams.fecha !== null) {
                detalleInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                    vm.inseminacion = data;
                    vm.rowCollection = vm.inseminacion.listaBovinos;
                    vm.disabled = false;
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }//fin inicializar


    }//fin archivo
})();