﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', '$sessionStorage', '$localStorage', 'portalService', 'toastr', '$state'];

    function reporteBovinoController($scope, reporteBovinoService, $sessionStorage, $localStorage, portalService, toastr, $state) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarPDF = exportarPDF;
        vm.exportarExcel = exportarExcel;
        vm.changeCategorias = changeCategorias;
        vm.changeEstados = changeEstados;

        //variables
        window.scrollTo(0, 0);
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        //vm.establecimientos = [];
        vm.filtro = {};



        function inicializar() {
            $scope.$parent.blockSpinner();
            reporteBovinoService.inicializar({
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                vm.rowCollection = data;
                $scope.$parent.unBlockSpinner();
                if (vm.rowCollection.length === 0) {
                    toastr.info("No se ha encontrado ningún Bovino", "Aviso");
                    $state.go('home.reportes');
                }                
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
            reporteBovinoService.generarExcel({
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