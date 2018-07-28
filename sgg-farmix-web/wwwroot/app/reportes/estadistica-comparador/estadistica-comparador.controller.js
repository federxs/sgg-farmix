(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaComparadorController', estadisticaComparadorController);

    estadisticaComparadorController.$inject = ['$location', '$scope', '$sessionStorage', 'estadisticaComparadorService', 'toastr', 'estadisticaBovinoService', 'estadisticaEventoService', 'estadisticaInseminacionService'];

    function estadisticaComparadorController($location, $scope, $sessionStorage, estadisticaComparadorService, toastr, estadisticaBovinoService, estadisticaEventoService, estadisticaInseminacionService) {
        var vm = $scope;
        vm.title = 'estadisticaComparadorController';
        window.scrollTo(0, 0);
        vm.filtro = {};
        vm.campos1 = [];
        vm.campos2 = [];
        vm.estadisticas = [];
        vm.comparar = comparar;
        vm.limpiar = limpiar;
        vm.mostrarBovino = false;
        vm.mostrarEvento = false;
        vm.mostrarInseminacion = false;
        init();
        function init() {
            $scope.$parent.blockSpinner();
            vm.estadisticas[0] = { id: 1, estadistica: 'Bovino' }
            vm.estadisticas[1] = { id: 2, estadistica: 'Evento' }
            vm.estadisticas[2] = { id: 3, estadistica: 'Inseminacion' }
            vm.filtro.estadistica = '';
            estadisticaComparadorService.inicializarCampos($sessionStorage.usuarioInfo.usuario, $sessionStorage.usuarioInfo.idRol).then(function (data) {
                vm.campos1 = data;
                vm.campos2 = data;
                vm.filtro.campo1 = '';
                vm.filtro.campo2 = '';
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
            estadisticaComparadorService.inicializarPeriodos().then(function (data) {
                vm.periodos1 = data.periodos;
                vm.periodos2 = data.periodos;
                vm.filtro.periodo1 = '';
                vm.filtro.periodo2 = '';
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
            $scope.$parent.unBlockSpinner();
        }

        function comparar() {
            if (vm.filtro.estadistica == 1) {
                $scope.$parent.blockSpinner();
                vm.mostrarBovino = true;
                vm.mostrarEvento = false;
                vm.mostrarInseminacion = false;
                estadisticaBovinoService.inicializar({ codigoCampo: vm.filtro.campo1, periodo: vm.filtro.periodo1 }, function (data) {
                    vm.mostrarBovino = true;
                    $scope.obj = data;
                    cargarGraficoPesoPorRazaYSexo($scope.obj.pesosPromXRaza, 'graficoPesoPorRazaYSexo1', 'descargaGraficoPesoPorRazaYSexo1');
                    cargarGraficoBajasPorMes($scope.obj.bajasXMes, 'graficoBajasPorMes1', 'descargaGraficoBajasPorMes1');
                    cargarGraficoTop10BovinosMasLivianos($scope.obj.top10BovinosMasLivianos, 'top10BovinosMasLivianos1');
                    cargarGraficoPorcentajeBovinoPorRodeo($scope.obj.bovinosXRodeo, 'graficoPorcentajeBovinoPorRodeo1');
                    cargarGraficoNacimientosPorMes($scope.obj.nacimientos, 'graficoNacimientosPorMes1', 'descargaGraficoNacimientosPorMes1');
                    $scope.$parent.unBlockSpinner();
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
                $scope.$parent.blockSpinner();
                estadisticaBovinoService.inicializar({ codigoCampo: vm.filtro.campo2, periodo: vm.filtro.periodo2 }, function (data) {
                    $scope.obj = data;
                    cargarGraficoPesoPorRazaYSexo($scope.obj.pesosPromXRaza, 'graficoPesoPorRazaYSexo2', 'descargaGraficoPesoPorRazaYSexo2');
                    cargarGraficoBajasPorMes($scope.obj.bajasXMes, 'graficoBajasPorMes2', 'descargaGraficoBajasPorMes2');
                    cargarGraficoTop10BovinosMasLivianos($scope.obj.top10BovinosMasLivianos, 'top10BovinosMasLivianos2');
                    cargarGraficoPorcentajeBovinoPorRodeo($scope.obj.bovinosXRodeo, 'graficoPorcentajeBovinoPorRodeo2');
                    cargarGraficoNacimientosPorMes($scope.obj.nacimientos, 'graficoNacimientosPorMes2', 'descargaGraficoNacimientosPorMes2');
                    $scope.$parent.unBlockSpinner();
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            } else if (vm.filtro.estadistica == '2') {
                $scope.$parent.blockSpinner();
                vm.mostrarEvento = true;
                vm.mostrarBovino = false;
                vm.mostrarInseminacion = false;
                estadisticaEventoService.inicializar({ codigoCampo: vm.filtro.campo1, periodo: vm.filtro.periodo1 }, function (data) {
                    $scope.obj = data;
                    cargarGraficoAntibioticosMasUsados($scope.obj.antibioticosMasUsados, 'graficoAntibioticosMasUsados1', 'descargaGraficoAntibioticosMasUsados1');
                    cargarGraficoCambiosAlimentacionXBovino($scope.obj.cambiosAlimentacionXBovino, 'graficoCambiosAlimentacionXBovino1');
                    cargarGraficoMovimientosXBovino($scope.obj.movimientosXBovino, 'graficoMovimientosXBovino1', 'descargaGraficoMovimientosXBovino1');
                    cargarGraficoEventosXTipoXMes($scope.obj.eventosXTipoXMes, 'graficoEventosXTipoXMes1');
                    cargarGraficoEventosXTipoXGenero($scope.obj.eventosXTipoXGenero, 'graficoEventosXTipoXGenero1', 'descargaGraficoEventosXTipoXGenero1');
                    cargarGraficoVacunasMenosUsadas($scope.obj.vacunasMenosUsadas, 'graficoVacunasMenosUsadas1', 'descargaGraficoVacunasMenosUsadas1');
                    cargarGraficotop10Alimentos($scope.obj.top10Alimentos, 'graficotop10Alimentos1');
                    $scope.$parent.unBlockSpinner();
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
                estadisticaEventoService.inicializar({ codigoCampo: vm.filtro.campo2, periodo: vm.filtro.periodo2 }, function (data) {
                    $scope.obj = data;
                    cargarGraficoAntibioticosMasUsados($scope.obj.antibioticosMasUsados, 'graficoAntibioticosMasUsados2', 'descargaGraficoAntibioticosMasUsados2');
                    cargarGraficoCambiosAlimentacionXBovino($scope.obj.cambiosAlimentacionXBovino, 'graficoCambiosAlimentacionXBovino2');
                    cargarGraficoMovimientosXBovino($scope.obj.movimientosXBovino, 'graficoMovimientosXBovino2', 'descargaGraficoMovimientosXBovino2');
                    cargarGraficoEventosXTipoXMes($scope.obj.eventosXTipoXMes, 'graficoEventosXTipoXMes2');
                    cargarGraficoEventosXTipoXGenero($scope.obj.eventosXTipoXGenero, 'graficoEventosXTipoXGenero2', 'descargaGraficoEventosXTipoXGenero2');
                    cargarGraficoVacunasMenosUsadas($scope.obj.vacunasMenosUsadas, 'graficoVacunasMenosUsadas2', 'descargaGraficoVacunasMenosUsadas2');
                    cargarGraficotop10Alimentos($scope.obj.top10Alimentos, 'graficotop10Alimentos2');
                    $scope.$parent.unBlockSpinner();
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            } else if (vm.filtro.estadistica == '3') {
                $scope.$parent.blockSpinner();
                vm.mostrarEvento = false;
                vm.mostrarBovino = false;
                vm.mostrarInseminacion = true;
                estadisticaInseminacionService.inicializar({ codigoCampo: vm.filtro.campo1, periodo: vm.filtro.periodo1 }, function (data) {
                    $scope.obj = data;
                    cargarGraficoXCategoriaHembrasEfectividad($scope.obj.inseminacionXCategoriaHembra, 'graficoCategoriasPorHembrasEfectividad1', 'descargaGraficoCategoriasPorHembrasEfectividad1');
                    cargarGraficoXCategoriaMachosEfectividad($scope.obj.inseminacionXCategoriaMacho, 'graficoCategoriasPorMachosEfectividad1', 'descargaGraficoCategoriasPorMachosEfectividad1');
                    cargarGraficoRazaEfectividad($scope.obj.inseminacionXRaza, 'graficoRazaEfectividad1', 'descargaGraficoRazaEfectividad1');
                    cargarGraficoTipoEfectividad($scope.obj.inseminacionXTipo, 'graficoTipoEfectividad1', 'descargaGraficoTipoEfectividad1');
                    cargarGraficoTorosInseminacionesExitosas($scope.obj.inseminacionExitosaXToro, 'graficoInseminacionesXToro1', 'descargaGraficoInseminacionesXToro1');
                    cargarGraficoTorosMasHijos($scope.obj.hijosXToro, 'graficoHijosXToro1', 'descargaGraficoHijosXToro1');
                    cargarGraficoVacasInseminacionesFallidas($scope.obj.inseminacionFallidaXVaca, 'graficoInseminacionesFallidas1', 'descargaGraficoInseminacionesFallidas1');
                    cargarGraficoVacasMasHijos($scope.obj.hijosXVaca, 'graficoHijosXVaca1', 'descargaGraficoHijosXVaca1');
                    cargarGraficoAbortosXVaca($scope.obj.abortosXVaca, 'graficoAbortosXVaca1');
                    $scope.$parent.unBlockSpinner();
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
                estadisticaInseminacionService.inicializar({ codigoCampo: vm.filtro.campo2, periodo: vm.filtro.periodo2 }, function (data) {
                    $scope.obj = data;
                    cargarGraficoXCategoriaHembrasEfectividad($scope.obj.inseminacionXCategoriaHembra, 'graficoCategoriasPorHembrasEfectividad2', 'descargaGraficoCategoriasPorHembrasEfectividad2');
                    cargarGraficoXCategoriaMachosEfectividad($scope.obj.inseminacionXCategoriaMacho, 'graficoCategoriasPorMachosEfectividad2', 'descargaGraficoCategoriasPorMachosEfectividad2');
                    cargarGraficoRazaEfectividad($scope.obj.inseminacionXRaza, 'graficoRazaEfectividad2', 'descargaGraficoRazaEfectividad2');
                    cargarGraficoTipoEfectividad($scope.obj.inseminacionXTipo, 'graficoTipoEfectividad2', 'descargaGraficoTipoEfectividad2');
                    cargarGraficoTorosInseminacionesExitosas($scope.obj.inseminacionExitosaXToro, 'graficoInseminacionesXToro2', 'descargaGraficoInseminacionesXToro2');
                    cargarGraficoTorosMasHijos($scope.obj.hijosXToro, 'graficoHijosXToro2', 'descargaGraficoHijosXToro2');
                    cargarGraficoVacasInseminacionesFallidas($scope.obj.inseminacionFallidaXVaca, 'graficoInseminacionesFallidas2', 'descargaGraficoInseminacionesFallidas2');
                    cargarGraficoVacasMasHijos($scope.obj.hijosXVaca, 'graficoHijosXVaca2', 'descargaGraficoHijosXVaca2');
                    cargarGraficoAbortosXVaca($scope.obj.abortosXVaca, 'graficoAbortosXVaca2');
                    $scope.$parent.unBlockSpinner();
                }, function (error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function cargarGraficoPesoPorRazaYSexo(data, titulo, img) {
            var datos = data;
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ id: 'N', label: 'Nombre', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Hembra', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Macho', type: 'number' });
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].nombre, datos[i].pesoPromedioHembra, datos[i].pesoPromedioMacho]]);
                }
                var options = {
                    'title': 'Peso Promedio según Raza y Sexo',
                    hAxis: {
                        title: 'Peso en kg'
                    },
                    vAxis: {
                        title: 'Razas'
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

        function cargarGraficoBajasPorMes(data, titulo, img) {
            var datos = data;
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ id: 'mes', label: 'Mes', type: 'string' });
                dataTable.addColumn({ id: 'muertes', label: 'Muertes', type: 'number' });
                dataTable.addColumn({ id: 'ventas', label: 'Ventas', type: 'number' });
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].mes.toString(), datos[i].cantidadMuertes, datos[i].cantidadVentas]]);
                }
                var options = {
                    'title': 'Cantidad de Bajas por Muerte o Venta por Mes',
                    hAxis: {
                        title: 'Mes'
                    },
                    vAxis: {
                        title: 'Nº de bajas'
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

        function cargarGraficoPorcentajeBovinoPorRodeo(data, titulo) {
            var datos = data;
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.PieChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ id: 'rodeo', label: 'Rodeo', type: 'string' });
                dataTable.addColumn({ id: 'porcentaje', label: 'Porcentaje', type: 'number' });
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].rodeo, datos[i].cantidad]]);
                }
                var options = {
                    'title': 'Porcentaje de Bovinos por Rodeo',
                    pieHole: 0.4,
                    'chartArea': { 'width': '100%', 'height': '100%' },
                    'legend': {
                        'position': 'left',
                        'textStyle': { 'fontSize': 12 }
                    }
                };
                chart.draw(dataTable, options);
            }
        }

        function cargarGraficoTop10BovinosMasLivianos(data, titulo) {
            var datos = data;
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById(titulo);
                var table = new google.visualization.Table(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Peso');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].peso]]);
                }
                var options = {
                    title: 'Top 10 Bovinos más livianos',
                    pageSize: 10,
                    sortColumn: 1,
                    sortAscending: true,
                    cssClassNames: { tableCell: 'row' }
                };
                table.draw(dataTable, options);
            }
        };

        function cargarGraficoNacimientosPorMes(data, titulo, img) {
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
                    dataTable.addRows([[datos[i].mes.toString(), datos[i].cantidadNacimientos]]);
                }
                var options = {
                    'title': 'Cantidad de Nacimientos por Mes',
                    hAxis: {
                        title: 'Meses'
                    },
                    vAxis: {
                        title: 'Cantidad de bovinos'
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

        function cargarGraficoAntibioticosMasUsados(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Antibiótico');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].antibiotico, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Antibióticos más usados',
                    legend: 'none',
                    width: 600,
                    height: 300,
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad' },
                    hAxis: {
                        title: 'Antibióticos',
                        viewWindow: { min: 0 }
                    },
                    colors: ["#00b01c"]

                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }

        function cargarGraficoCambiosAlimentacionXBovino(data, titulo) {
            var datos = data;

            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.Table(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Cantidad de Cambios');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Cantidad de Cambios de alimentación por Bovino',
                    pageSize: 6,
                    sortColumn: 1,
                    sortAscending: false,
                    cssClassNames: { tableCell: 'row' }
                };
                chart.draw(dataTable, options);
            }
        };

        function cargarGraficoMovimientosXBovino(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Top 10 Bovinos con mayor cambio de Rodeos',
                    legend: 'none',
                    height: 300,
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad' },
                    hAxis: {
                        title: 'Número de Caravana',
                        viewWindow: { min: 0 }
                    },
                    colors: ["#CCCC00"]
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoEventosXTipoXMes(data, titulo) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.charts.Bar(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Mes');
                dataTable.addColumn('number', 'Cantidad Alimenticio');
                dataTable.addColumn('number', 'Cantidad Antibiótico');
                dataTable.addColumn('number', 'Cantidad Manejo');
                dataTable.addColumn('number', 'Cantidad Vacunación');
                var mes = "";
                for (var i = 0; i < datos.length; i++) {
                    if (!(datos[i].cantidadAlimenticio == 0 && datos[i].cantidadAntibiotico == 0 && datos[i].cantidadManejo == 0 && datos[i].cantidadVacunacion == 0)) {
                        dataTable.addRows([[datos[i].mes, datos[i].cantidadAlimenticio, datos[i].cantidadAntibiotico, datos[i].cantidadManejo, datos[i].cantidadVacunacion]]);
                    }
                }

                var options = {
                    title: 'Cantidad de Eventos por tipo en cada mes',
                    legend: 'none',
                    height: 300
                };
                chart.draw(dataTable, options);
            }
        }

        function cargarGraficoEventosXTipoXGenero(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Evento', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Cantidad Macho', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Cantidad Hembra', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].tipoEvento, datos[i].cantidadMacho, datos[i].cantidadHembra]]);
                }

                var options = {
                    'title': 'Eventos por Tipo y por Sexo',
                    hAxis: {
                        title: 'Cantidad'
                    },
                    vAxis: {
                        title: 'Tipos de Eventos'
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

        function cargarGraficotop10Alimentos(data, titulo) {
            var datos = data;

            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.Table(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Alimento');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].alimento, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Top 10 Alimentos más usados',
                    pageSize: 6,
                    sortColumn: 1,
                    sortAscending: false,
                    cssClassNames: { tableCell: 'row' }
                };
                chart.draw(dataTable, options);
            }
        };

        function cargarGraficoVacunasMenosUsadas(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Vacuna');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].vacuna, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Vacunas menos usadas',
                    legend: 'none',
                    height: 400,
                    chartArea: {
                        top: 55
                    },

                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad' },
                    hAxis: {
                        title: 'Vacunas'
                        //slantedText: true,
                        //slantedTextAngle: 45
                    },
                    colors: ["#ff5c33"]

                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }

        function cargarGraficoXCategoriaHembrasEfectividad(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Categoria', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].categoria, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad de Hembras por Categoría',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Categorías'
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

        function cargarGraficoXCategoriaMachosEfectividad(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Categoria', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].categoria, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad de Machos por Categoría',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Categorías'
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

        function cargarGraficoRazaEfectividad(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Raza', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].raza, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad de Hembras por Raza',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Razas'
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

        function cargarGraficoTipoEfectividad(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.BarChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'N', label: 'Tipo', type: 'string' });
                dataTable.addColumn({ id: 'Id1', label: 'Exitosa', type: 'number' });
                dataTable.addColumn({ id: 'Id2', label: 'Fallida', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].tipo, datos[i].cantidadExitosa, datos[i].cantidadFallida]]);
                }

                var options = {
                    'title': 'Efectividad según el tipo de Inseminación',
                    hAxis: {
                        title: 'Inseminaciones'
                    },
                    vAxis: {
                        title: 'Tipos'
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

        function cargarGraficoTorosInseminacionesExitosas(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Inseminaciones');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Inseminaciones Exitosas Por Toro',
                    legend: 'none',
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Inseminaciones Exitosas' },
                    hAxis: {
                        title: 'Número de Caravana'
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

        function cargarGraficoTorosMasHijos(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidadHijos]]);
                }

                var options = {
                    title: 'Cantidad de Hijos Por Toro',
                    legend: 'none',
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad de Hijos' },
                    hAxis: {
                        title: 'Número de Caravana',
                        viewWindow: { min: 0 }
                    },
                    colors: ["#00b01c"]
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoVacasInseminacionesFallidas(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidad]]);
                }

                var options = {
                    title: 'Cantidad de Inseminaciones Fallidas por Vaca',
                    legend: 'none',
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad de Inseminaciones' },
                    hAxis: {
                        title: 'Número de Caravana'
                    },
                    colors: ["gray"]
                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoVacasMasHijos(data, titulo, img) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Cantidad');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidadHijos]]);
                }

                var options = {
                    title: 'Cantidad de Hijos Por Vaca',
                    legend: 'none',
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad de Hijos' },
                    hAxis: {
                        title: 'Número de Caravana',
                        viewWindow: { min: 0 }
                    },
                    colors: ["#00b01c"]

                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById(img);
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoAbortosXVaca(data, titulo) {
            var datos = data;

            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById(titulo);
                var chart = new google.visualization.Table(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Número Caravana');
                dataTable.addColumn('number', 'Cantidad de Abortos');
                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].numCaravana, datos[i].cantidadAbortos]]);
                }

                var options = {
                    title: 'Cantidad de Abortos Por Vaca',
                    pageSize: 6,
                    sortColumn: 1,
                    sortAscending: false,
                    cssClassNames: { tableCell: 'row' }
                };
                chart.draw(dataTable, options);
            }
        };

        function limpiar() {
            vm.mostrarBovino = false;
            vm.mostrarEvento = false;
            vm.mostrarInseminacion = false;
            vm.filtro.campo1 = '';
            vm.filtro.campo2 = '';
            vm.filtro.periodo1 = '';
            vm.filtro.periodo2 = '';
            vm.filtro.estadistica = '';
        }
    }
})();
