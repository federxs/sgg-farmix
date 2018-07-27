(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', '$sessionStorage', '$localStorage', 'portalService', 'toastr', '$state', 'consultarBovinoService'];

    function reporteBovinoController($scope, reporteBovinoService, $sessionStorage, $localStorage, portalService, toastr, $state, consultarBovinoService) {
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
        $('[data-toggle="tooltip"]').tooltip();
        vm.filtro = {};
        var estados = [];
        var categorias = [];


        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            consultarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                vm.categorias = data.categorias;
                categorias = angular.copy(data.categorias);
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.filtro.idCategoria = '0';
                vm.filtro.genero = '2';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                consultar();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function consultar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            if (vm.filtro.peso === '' || vm.filtro.peso === undefined) vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '' || vm.filtro.numCaravana === null) vm.filtro.numCaravana = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            reporteBovinoService.obtenerReportesFiltro({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.disabled = '';
                    vm.rowCollection = [];
                    vm.filtro.peso = '';
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.peso === 0) vm.filtro.peso = '';
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
                $('.modal-backdrop').remove();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.idCategoria = '0';
            vm.filtro.genero = '2';
            vm.filtro.idRaza = '0';
            vm.filtro.idRodeo = '0';
            vm.filtro.idEstado = '0';
            vm.filtro.accionPeso = '0';
            vm.filtro.numCaravana = '';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        };

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function changeEstados() {
            if (vm.filtro.genero === '1') {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.filtro.genero === '0') {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeCategorias() {
            if (vm.filtro.genero === '1') {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else if (vm.filtro.genero === '0' || vm.filtro.genero === 0) {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
            }
            else
                vm.categorias = categorias;
        };

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (vm.filtro.peso === '' || vm.filtro.peso === undefined) vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '' || vm.filtro.numCaravana === null) vm.filtro.numCaravana = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            reporteBovinoService.generarPDF({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
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
            if (vm.filtro.peso === '' || vm.filtro.peso === undefined) vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '' || vm.filtro.numCaravana === null) vm.filtro.numCaravana = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            reporteBovinoService.generarExcel({ 'filtro': angular.toJson(vm.filtro, false)}, function (data) {
                if (vm.filtro.numCaravana == 0) vm.filtro.numCaravana = '';
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
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