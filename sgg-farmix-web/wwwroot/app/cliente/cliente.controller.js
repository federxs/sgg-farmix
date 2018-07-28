(function () {
    'use strict';

    angular
        .module('app')
        .controller('clienteController', clienteController);

    clienteController.$inject = ['$scope', 'clienteService', '$localStorage', 'toastr', 'usuarioInfo', '$state'];

    function clienteController($scope, clienteService, $localStorage, toastr, usuarioInfo, $state) {
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
            clienteService.getClientes().then(function (data) {
                if (vm.filtro.idPlan != '0' || vm.filtro.estadoCuenta != '0' || vm.filtro.fechaDesde != undefined || vm.filtro.fechaHasta != undefined || vm.filtro.apellido != undefined || vm.filtro.nombre != undefined) {
                    var borrar;
                    for (var i = 0; i < data.length; i++) {
                        borrar = false
                        if (vm.filtro.idPlan != '0') {
                            if (data[i].idPlan != vm.filtro.idPlan) {
                                borrar = true;
                            }
                        }
                        if (vm.filtro.estadoCuenta != '0') {
                            if (data[i].estadoCuenta != vm.filtro.estadoCuenta) {
                                console.log(data[i].estadoCuenta);
                                borrar = true;
                            }
                        }
                        if (vm.filtro.fechaDesde != undefined) {
                            if (data[i].fechaAlta <= vm.filtro.fechaDesde) {
                                borrar = true;
                            }
                        }
                        if (vm.filtro.fechaHasta != undefined) {
                            if (data[i].fechaAlta >= vm.filtro.fechaHasta) {
                                borrar = true;
                            }
                        }
                        if (vm.filtro.apellido != undefined) {
                            if (!data[i].apellido.toUpperCase().includes(vm.filtro.apellido.toUpperCase())) {
                                borrar = true;
                            }
                        }
                        if (vm.filtro.nombre != undefined) {
                            if (!data[i].nombre.toUpperCase().includes(vm.filtro.nombre.toUpperCase())) {
                                borrar = true;
                            }
                        }
                        if (borrar) {
                            data.splice(i, 1);
                            i--;
                        }
                    }
                }
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
            var fechaMin = new Date(2000, 1, 1);
            if (fechaDesde < fechaMin) {
                vm.formFiltrarClientes.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formFiltrarClientes.fechaDesde.$setValidity("min", true);
            }
        }

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
        }

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
        }

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
        }
    }
})();
