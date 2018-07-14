(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarConflictoController', consultarConflictoController);

    consultarConflictoController.$inject = ['$scope', 'consultarConflictoService', 'toastr', '$localStorage', '$state', 'exportador', '$stateParams', 'portalService'];

    function consultarConflictoController($scope, consultarConflictoService, toastr, $localStorage, $state, exportador, $stateParams, portalService) {
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

        function init() {
            if ($localStorage.proviene) {
                $localStorage.proviene = null;
                $state.reload();
            }                
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
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            consultarConflictoService.obtenerConflictos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.disabled = '';
                    vm.rowCollection = [];
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    vm.disabled = '';
                    vm.disabledExportar = '';
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
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Tipo de Conflicto';
            filtro.Titulos[1] = 'Estado';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var titulos = [];
            titulos[0] = "Tipo de Conflicto";
            titulos[1] = "Fecha";
            titulos[2] = "Estado";

            var propiedades = [];
            propiedades[0] = "tipo";
            propiedades[1] = "fecha";
            propiedades[2] = "estado";

            if (vm.rowCollection.length > 0) {
                var i = 0;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "codigoCampo") {
                        if (property === "tipo") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '1') {
                                filtro[i] = 'Evento';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Inseminación';
                                i += 1;
                            }
                        }
                        else if (property === "estado") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '1') {
                                filtro[i] = 'Solucionado';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Pendiente';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel('Conflictos' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Conflictos', function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
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
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            consultarConflictoService.generarPDF({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
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
                vm.formConsultarConflicto.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formConsultarConflicto.fechaDesde.$setValidity("min", true);
            }
        };

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formConsultarConflicto.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formConsultarConflicto.fechaHasta.$setValidity("min", true);
                }
            }
        };
    }
})();
