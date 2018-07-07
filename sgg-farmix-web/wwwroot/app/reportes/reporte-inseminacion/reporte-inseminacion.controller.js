(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteInseminacionController', reporteInseminacionController);

    reporteInseminacionController.$inject = ['$scope', 'reporteInseminacionService', '$stateParams', '$localStorage', '$state', 'toastr'];

    function reporteInseminacionController($scope, reporteInseminacionService, $stateParams, $localStorage, $state, toastr) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        vm.disabledExportar = 'disabled';
        vm.itemsPorPagina = 50;
        vm.tablaActiva = $stateParams.tabla;

        inicializar()


        function inicializar() {
            if (vm.tablaActiva === 0) {
                reporteInseminacionService.getHembrasParaServir({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.hembrasParaServir = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.hembrasParaServir.length === 0) {
                        toastr.info("No se ha encontrado ninguna Hembra para Servir", "Aviso");
                        $state.go('home.reportes');
                    }                    
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 1) {
                reporteInseminacionService.getLactanciasActivas({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.lactanciasActivas = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.lactanciasActivas.length === 0) {
                        toastr.info("No se ha encontrado ninguna Lactancia activa", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }

            else if (vm.tablaActiva === 2) {
                reporteInseminacionService.getPreniadas({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.preniadas = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.preniadas.length === 0) {
                        toastr.info("No se ha encontrado ninguna vaca Preñada", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 3) {
                reporteInseminacionService.getServiciosSinConfirmar({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.serviciosSinConfirmar = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.serviciosSinConfirmar.length === 0) {
                        toastr.info("No se ha encontrado ningún Servicio sin Confirmar", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
        }//inicializar


    }
})();