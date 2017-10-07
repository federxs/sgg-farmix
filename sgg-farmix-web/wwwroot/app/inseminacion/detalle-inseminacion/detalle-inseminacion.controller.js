(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleInseminacionController', detalleInseminacionController);

    detalleInseminacionController.$inject = ['$scope', 'detalleInseminacionService', '$stateParams', 'toastr'];

    function detalleInseminacionController($scope, detalleInseminacionService, $stateParams, toastr) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.disabled = true;
        //funciones
        vm.inicializar = inicializar();
        //variables
        vm.inseminacion = {};
        vm.desde = $stateParams.desde;
        function inicializar() {
            vm.showSpinner = true;
            vm.disabled = true;
            vm.itemsPorPagina = 9;
            if ($stateParams.fecha !== null) {
                detalleInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                    vm.inseminacion = data;
                    vm.rowCollection = vm.inseminacion.listaBovinos;
                    vm.disabled = false;
                    //seteamos a "" las variables 0
                    //angular.forEach(vm.evento, function (value, key) {
                    //    if (parseInt(value) === 0 && key !== 'idEvento') {
                    //        vm.evento[key] = '';
                    //    }
                    //});
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }//fin inicializar


    }//fin archivo
})();