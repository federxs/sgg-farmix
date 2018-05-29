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
                vm.fecha = $stateParams.fecha;
                detalleInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                    vm.inseminacion = data;
                    if (vm.inseminacion.fechaEstimadaNacimiento !== '') {
                        vm.vaca = vm.inseminacion.listaBovinos[0];
                        vm.tactos = vm.inseminacion.tactos;
                        //for (var i = 0; i < vm.tactos.length; i++) {
                        //    vm.tactos[i].numero = (i + 1);
                        //}
                    }
                    else
                        vm.rowCollection = vm.inseminacion.listaBovinos;
                    vm.tituloTabla = 'Bovinos que participaron de la inseminación';
                    vm.disabled = false;
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
            else if (vm.desde === 'hembrasParaServ') {
                detalleInseminacionService.getHembrasServicio().then(function successs(data) {
                    vm.rowCollection = data;
                    vm.tituloTabla = 'Hembras para servicio';
                    vm.disabled = false;
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                })
            }
            else if (vm.desde === 'lactanciasActivas') {
                detalleInseminacionService.getLactancias().then(function successs(data) {
                    vm.rowCollection = data;
                    vm.tituloTabla = 'Vacas dando de lactar';
                    vm.disabled = false;
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                })
            }
            vm.showSpinner = false;
        }//fin inicializar


    }//fin archivo
})();