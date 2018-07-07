(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', 'exportador', '$localStorage', 'portalService', 'toastr'];

    function reporteBovinoController($scope, reporteBovinoService, exportador, $localStorage, portalService, toastr) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        window.scrollTo(0, 0);
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;

        vm.exportarPDF = exportarPDF;
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
                $scope.$parent.errorServicio(error.statusText);
            });
        }

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteBovinoService.generarPDF({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };
    }
})();