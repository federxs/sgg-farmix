(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteEventoController', reporteEventoController);

    reporteEventoController.$inject = ['$scope', 'reporteEventoService', '$localStorage', 'portalService', 'toastr', '$state', '$sessionStorage', 'tipoEventoService'];

    function reporteEventoController($scope, reporteEventoService, $localStorage, portalService, toastr, $state, $sessionStorage, tipoEventoService) {
        var vm = $scope;
        window.scrollTo(0, 0);
        $('.modal-backdrop').remove();
        $('[data-toggle="tooltip"]').tooltip();
        vm.disabled = 'disabled';
        vm.disabledExportar = 'disabled';
        vm.tipoEventoPopUp = '';
        vm.fecha = '';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.getFechaDesde = getFechaDesde;
        vm.getFechaHasta = getFechaHasta;
        vm.exportarPDF = exportarPDF;
        //variables       
        vm.filtro = {};
        vm.cursor = '';
        vm.numCaravanaFiltro;
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();
        vm.itemsPorPagina = 50;

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabledExportar = 'disabled';
            vm.disabled = 'disabled';
            tipoEventoService.inicializar({}).then(function success(data) {
                vm.TiposEventos = data;
                vm.filtro.idTipoEvento = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                vm.disabled = '';
                consultar();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        }

        function consultar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            if (vm.filtro.fechaDesde !== undefined) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta !== undefined) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            reporteEventoService.consultarEventos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                vm.numCaravanaFiltro = undefined;
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.disabled = '';
                    vm.rowCollection = [];
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
                $('.modal-backdrop').remove();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function limpiarCampos() {
            $state.reload();
        };

        function convertirFecha(fecha) {
            var dia, mes, año, hora, min;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            hora = fecha.getHours().toString();
            if (hora.length === 1)
                hora = '0' + hora;
            min = fecha.getMinutes().toString();
            if (min.length === 1)
                min = '0' + min;
            return dia + '/' + mes + '/' + año + ' ' + hora + ':' + min;
        };

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            reporteEventoService.generarPDF({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
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
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            reporteEventoService.generarExcel({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
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

        function getFechaDesde() {
            vm.filtro.fechaDesde = $('#datetimepicker4')[0].value;
            var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaDesde < fechaMin) {
                vm.formConsultarReporteEvento.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formConsultarReporteEvento.fechaDesde.$setValidity("min", true);
            }
        }

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formConsultarReporteEvento.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formConsultarReporteEvento.fechaHasta.$setValidity("min", true);
                }
            }
        }
    }
})();