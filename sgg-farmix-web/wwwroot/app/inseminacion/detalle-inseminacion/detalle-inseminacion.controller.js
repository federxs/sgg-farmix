(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleInseminacionController', detalleInseminacionController);

    detalleInseminacionController.$inject = ['$scope', 'detalleInseminacionService', '$stateParams', 'toastr'];

    function detalleInseminacionController($scope, detalleInseminacionService, $stateParams, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.inseminacion = {};
        vm.desde = $stateParams.desde;
        vm.itemsPorPaginaTacto = 10;
        vm.disabled = true;
        //funciones
        vm.inicializar = inicializar();


        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabled = true;
            vm.itemsPorPagina = 9;
            if ($stateParams.fecha !== null && $stateParams.fecha !== 'null') {
                vm.fecha = $stateParams.fecha;
                vm.tipoInseminacion = $stateParams.tipoInseminacion;
                detalleInseminacionService.getInseminacion($stateParams.fecha, vm.tipoInseminacion).then(function success(data) {
                    vm.inseminacion = data;
                    if (vm.inseminacion.fechaEstimadaNacimiento !== '') {
                        vm.vaca = vm.inseminacion.listaBovinos[0];
                        if (vm.inseminacion.idTipoInseminacion === 2)
                            vm.toro = vm.inseminacion.listaToros[0];
                        vm.tactos = vm.inseminacion.tactos;
                    }
                    else {
                        vm.rowCollection = vm.inseminacion.listaBovinos;
                        vm.torosCollection = vm.inseminacion.listaToros;
                    }
                    vm.tituloTabla = 'Bovinos que participaron de la inseminación';
                    vm.disabled = false;
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.desde === 'hembrasParaServ') {
                detalleInseminacionService.getHembrasServicio().then(function successs(data) {
                    vm.rowCollection = data;
                    vm.tituloTabla = 'Hembras para servicio';
                    vm.disabled = false;
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                })
            }
            else if (vm.desde === 'lactanciasActivas') {
                detalleInseminacionService.getLactancias().then(function successs(data) {
                    vm.rowCollection = data;
                    vm.tituloTabla = 'Vacas dando de lactar';
                    vm.disabled = false;
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                })
            }
            else {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            }                
            //vm.showSpinner = false;
        }//fin inicializar


    }//fin archivo
})();