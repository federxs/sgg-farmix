(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteInseminacionController', reporteInseminacionController);

    reporteInseminacionController.$inject = ['$scope', 'reporteInseminacionService', '$stateParams', '$localStorage', '$state', 'toastr', 'portalService', '$sessionStorage', 'consultarBovinoService'];

    function reporteInseminacionController($scope, reporteInseminacionService, $stateParams, $localStorage, $state, toastr, portalService, $sessionStorage, consultarBovinoService) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        $('[data-toggle="tooltip"]').tooltip();
        vm.itemsPorPagina = 50;
        vm.tablaActiva = $stateParams.tabla;
        vm.filtro = {};

        vm.exportarHembrasServicioPDF = exportarHembrasServicioPDF;
        vm.exportarServiciosSinConfirmarPDF = exportarServiciosSinConfirmarPDF;
        vm.exportarLactanciasPDF = exportarLactanciasPDF;
        vm.exportarPreniadasPDF = exportarPreniadasPDF;
        vm.exportarHembrasServicioExcel = exportarHembrasServicioExcel;
        vm.exportarServiciosSinConfirmarExcel = exportarServiciosSinConfirmarExcel;
        vm.exportarLactanciasExcel = exportarLactanciasExcel;
        vm.exportarPreniadasExcel = exportarPreniadasExcel;
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            consultarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                vm.categorias = [];
                for (var i = 0; i < data.categorias.length; i++) {
                    if (data.categorias[i].genero === 0)
                        vm.categorias.push(data.categorias[i]);
                }
                vm.estados = [];
                for (var i = 0; i < data.estados.length; i++) {
                    if (data.estados[i].genero !== 1 && data.estados[i].nombre !== 'Muerto' && data.estados[i].nombre !== 'Venta')
                        vm.estados.push(data.estados[i]);
                }
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.filtro.idCategoria = '0';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                vm.filtro.accionNroPartos = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                consultar();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function consultar() {
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            if (vm.tablaActiva === 0) {
                reporteInseminacionService.getHembrasParaServir({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                    if (data.length === 0) {
                        vm.disabledExportar = 'disabled';
                        vm.disabled = '';
                        vm.hembrasParaServir = [];
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                        vm.filtro.numCaravana = '';
                        toastr.info("No se ha encontrado ninguna Hembra para Servir", "Aviso");
                    }
                    else {
                        vm.hembrasParaServir = data;
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                        vm.disabled = '';
                        vm.disabledExportar = '';
                        $scope.$parent.unBlockSpinner();
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
            else
                $state.go('home.reportes');
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.idCategoria = '0';
            vm.filtro.genero = '2';
            vm.filtro.idRaza = '0';
            vm.filtro.idRodeo = '0';
            vm.filtro.idEstado = '0';
            vm.filtro.accionPeso = '0';
            vm.filtro.accionNroPartos = '0';
            vm.filtro.numCaravana = '';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        };

        function exportarHembrasServicioPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            reporteInseminacionService.generarPDFHembrasServicio({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
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
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarServiciosSinConfirmarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFServiciosSinConfirmar({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
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

        function exportarLactanciasPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFLactancias({
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

        function exportarPreniadasPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFPreniadas({
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

        function exportarHembrasServicioExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            reporteInseminacionService.generarExcelHembrasServicio({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
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
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarServiciosSinConfirmarExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarExcelServiciosSinConfirmar({
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
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarLactanciasExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarExcelLactancias({
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

        function exportarPreniadasExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarExcelPreniadas({
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