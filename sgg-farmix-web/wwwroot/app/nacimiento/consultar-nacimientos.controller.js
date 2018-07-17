(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarNacimientosController', consultarNacimientosController);

    consultarNacimientosController.$inject = ['$scope', 'consultarNacimientosService', 'toastr', '$localStorage', '$state', 'exportador', '$stateParams', 'consultarBovinoService', 'portalService'];

    function consultarNacimientosController($scope, consultarNacimientosService, toastr, $localStorage, $state, exportador, $stateParams, consultarBovinoService, portalService) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();

        vm.init = init();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.getFechaDesde = getFechaDesde;
        vm.getFechaHasta = getFechaHasta;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;
        vm.validarSiPuedoAgregar = validarSiPuedoAgregar;

        function init() {
            vm.itemsPorPagina = 9;
            $scope.$parent.blockSpinner();
            vm.filtro = {};
            vm.filtro.tipo = '0';
            vm.filtro.estado = '2';
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        };

        function consultar() {
            $scope.$parent.blockSpinner();
            if (vm.filtro.fechaDesde) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            if (!vm.filtro.numCaravanaMadre) vm.filtro.numCaravanaMadre = 0;
            if (!vm.filtro.numCaravanaPadre) vm.filtro.numCaravanaPadre = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            consultarNacimientosService.obtenerNacimientos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.disabled = '';
                    vm.rowCollection = [];
                    vm.filtro.numCaravanaMadre = '';
                    vm.filtro.numCaravanaPadre = '';
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                    if (vm.filtro.numCaravanaMadre === 0) vm.filtro.numCaravanaMadre = '';
                    if (vm.filtro.numCaravanaPadre === 0) vm.filtro.numCaravanaPadre = '';
                }
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function limpiarCampos() {
            $state.reload();
        };

        function exportarExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (vm.filtro.fechaDesde) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            if (!vm.filtro.numCaravanaMadre) vm.filtro.numCaravanaMadre = 0;
            if (!vm.filtro.numCaravanaPadre) vm.filtro.numCaravanaPadre = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            consultarNacimientosService.generarExcel({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.numCaravanaMadre == 0) vm.filtro.numCaravanaMadre = '';
                if (vm.filtro.numCaravanaPadre == 0) vm.filtro.numCaravanaPadre = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (vm.filtro.fechaDesde) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            if (!vm.filtro.numCaravanaMadre) vm.filtro.numCaravanaMadre = 0;
            if (!vm.filtro.numCaravanaPadre) vm.filtro.numCaravanaPadre = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            consultarNacimientosService.generarPDF({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.numCaravanaMadre == 0) vm.filtro.numCaravanaMadre = '';
                if (vm.filtro.numCaravanaPadre == 0) vm.filtro.numCaravanaPadre = '';
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

        function convertirFecha(fecha) {
            var dia, mes, año, hora, min;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function getFechaDesde() {
            vm.filtro.fechaDesde = $('#datetimepicker4')[0].value;
            var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaDesde < fechaMin) {
                vm.formConsultarNacimiento.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formConsultarNacimiento.fechaDesde.$setValidity("min", true);
            }
        };

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formConsultarNacimiento.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formConsultarNacimiento.fechaHasta.$setValidity("min", true);
                }
            }
        };

        function validarSiPuedoAgregar(id) {
            $scope.$parent.blockSpinner();
            consultarBovinoService.validarCantBovinos({ campo: $localStorage.usuarioInfo.codigoCampo }, function success(data) {
                if (data.resultado)
                    $state.go('home.registrarBovino', { idNacimiento: id });
                else {
                    $scope.$parent.unBlockSpinner();
                    toastr.info("No puede agregar mas bovinos, verifique su plan contratado.", "Aviso");
                }
                //$scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };
    }
})();
