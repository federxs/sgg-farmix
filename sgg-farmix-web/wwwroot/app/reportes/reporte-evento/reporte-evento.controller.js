(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteEventoController', reporteEventoController);

    reporteEventoController.$inject = ['$scope', 'reporteEventoService', '$localStorage', 'portalService', 'toastr', '$state', '$sessionStorage'];

    function reporteEventoController($scope, reporteEventoService, $localStorage, portalService, toastr, $state, $sessionStorage) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();

        //variables
        window.scrollTo(0, 0);
        vm.bovinos = [];
        vm.itemsPorPagina = 50;

        vm.exportarPDF = exportarPDF;
        vm.exportarExcel = exportarExcel;

        function inicializar() {
            $scope.$parent.blockSpinner();
            reporteEventoService.inicializar({
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                vm.rowCollection = data;
                $scope.$parent.unBlockSpinner();
                if (vm.rowCollection.length === 0) {
                    toastr.info("No se ha encontrado ningún Evento", "Aviso");
                    $state.go('home.reportes');
                }                
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        }

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteEventoService.generarPDF({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta,
                usuario: $sessionStorage.usuarioInfo.usuario
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

        function exportarExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteEventoService.generarExcel({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta,
                usuario: $sessionStorage.usuarioInfo.usuario
            }, function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };
    }
})();