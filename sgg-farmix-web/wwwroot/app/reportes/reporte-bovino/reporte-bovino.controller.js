(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', 'exportador', '$localStorage'];

    function reporteBovinoController($scope, reporteBovinoService, exportador, $localStorage) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        window.scrollTo(0, 0);
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;


        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            reporteBovinoService.inicializar({
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                vm.rowCollection = data;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }
    }
})();