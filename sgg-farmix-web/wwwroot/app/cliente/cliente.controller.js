(function () {
    'use strict';

    angular
        .module('app')
        .controller('clienteController', clienteController);

    clienteController.$inject = ['$scope', 'clienteService', '$localStorage', 'toastr', 'usuarioInfo', '$state', '$sessionStorage', 'portalService'];

    function clienteController($scope, clienteService, $localStorage, toastr, usuarioInfo, $state, $sessionStorage, portalService) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.filtro = {};
        vm.fechaDeHoy = new Date();
        vm.filtro.idPlan = '0';
        vm.filtro.estadoCuenta = '0';
        vm.getFechaDesde = getFechaDesde;
        vm.getFechaHasta = getFechaHasta;
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;

        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();
        vm.displayedCollection = [];
        vm.mostrarEstadistica = false;
        vm.mostrar = mostrar;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.itemsPorPagina = 10;
            clienteService.inicializar().then(function (data) {
                vm.planes = data;
                consultar();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
            clienteService.inicializarPeriodos().then(function (data) {
                vm.periodos = data.periodos;
                vm.filtro.periodo = '';
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.idPlan = '0';
            vm.filtro.estadoCuenta = '0';
            consultar();
        }

        function consultar() {
            $scope.$parent.blockSpinner();
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
            //vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            clienteService.getClientes(angular.toJson(vm.filtro, false)).then(function (data) {                
                vm.rowCollection = data;
                $scope.$parent.unBlockSpinner();
                $('.modal-backdrop').remove();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function getFechaDesde() {
            vm.filtro.fechaDesde = $('#datetimepicker4')[0].value;
            var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if ((fechaDesde < fechaMin) || (((vm.filtro.fechaHasta !== undefined)) && (fechaDesde > fechaHasta))) {
                vm.formFiltrarClientes.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formFiltrarClientes.fechaDesde.$setValidity("min", true);
                vm.formFiltrarClientes.fechaHasta.$setValidity("min", true);
            }
        };

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formFiltrarClientes.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formFiltrarClientes.fechaHasta.$setValidity("min", true);
                }
            }
        };

        function mostrar() {
            $scope.$parent.blockSpinner();
            clienteService.estadisticas(vm.filtro.periodo).then(function (data) {
                console.log(data);
                vm.mostrarEstadistica = true;
                cargarGraficoPorMes(data.usuariosXMes, 'graficoRegistroUsuariosPorMes', 'descargaGraficoRegistroUsuariosPorMes', 'usuarios');
                cargarGraficoPorMes(data.bovinosXMes, 'graficoRegistroBovinosPorMes', 'descargaGraficoRegistroBovinosPorMes', 'bovinos');
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function cargarGraficoPorMes(data, titulo, img, tipo) {
            var datos = data;
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.LineChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ id: 'mes', label: 'Mes', type: 'string' });
                dataTable.addColumn({ id: 'cantidad', label: 'Cantidad', type: 'number' });
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].mes.toString(), datos[i].cantidad]]);
                }
                var options = {
                    'title': 'Cantidad de ' + tipo + ' registrados por mes',
                    hAxis: {
                        title: 'Meses'
                    },
                    vAxis: {
                        title: 'Cantidad de ' + tipo
                    },
                    'legend': {
                        'position': 'bottom',
                        'textStyle': { 'fontSize': 12 }
                    }
                };
                chart.draw(dataTable, options);
                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function exportarExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
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
            //vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            clienteService.generarExcel(angular.toJson(vm.filtro, false)).then(function (data) {
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

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
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
            //vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;            //vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            clienteService.generarPDF(angular.toJson(vm.filtro, false)).then(function (data) {
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
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        }
    }
})();
