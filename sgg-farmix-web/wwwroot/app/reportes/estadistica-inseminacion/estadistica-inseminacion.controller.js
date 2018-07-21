(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaInseminacionController', estadisticaInseminacionController);

    estadisticaInseminacionController.$inject = ['$location', '$scope', '$localStorage', 'estadisticaInseminacionService', 'toastr'];

    function estadisticaInseminacionController($location, $scope, $localStorage, estadisticaInseminacionService, toastr) {
        var vm = $scope;
        vm.title = 'estadisticaInseminacionController';
        window.scrollTo(0, 0);
        init();

        function init() {
            $scope.$parent.blockSpinner();
            estadisticaInseminacionService.inicializar({ codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta }, function (data) {
                $scope.obj = data;
                cargarGraficoXCategoriaHembrasEfectividad($scope.obj.inseminacionXCategoriaHembra);
                cargarGraficoXCategoriaMachosEfectividad($scope.obj.inseminacionXCategoriaMacho);
                cargarGraficoRazaEfectividad($scope.obj.inseminacionXRaza);
                cargarGraficoTipoEfectividad($scope.obj.inseminacionXTipo);
                cargarGraficoTorosInseminacionesExitosas($scope.obj.inseminacionExitosaXToro);
                cargarGraficoTorosMasHijos($scope.obj.hijosXToro);
                cargarGraficoVacasInseminacionesFallidas($scope.obj.inseminacionFallidaXVaca);
                cargarGraficoVacasMasHijos($scope.obj.hijosXVaca);
                cargarGraficoAbortosXVaca($scope.obj.abortosXVaca);
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function cargarGraficoXCategoriaHembrasEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCategoriasPorHembrasEfectividad');
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

                var my_anchor = document.getElementById('descargaGraficoCategoriasPorHembrasEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoXCategoriaMachosEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCategoriasPorMachosEfectividad');
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

                var my_anchor = document.getElementById('descargaGraficoCategoriasPorMachosEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoRazaEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoRazaEfectividad');
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

                var my_anchor = document.getElementById('descargaGraficoRazaEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoTipoEfectividad(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoTipoEfectividad');
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

                var my_anchor = document.getElementById('descargaGraficoTipoEfectividad');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoTorosInseminacionesExitosas(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoInseminacionesXToro');
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

                var my_anchor = document.getElementById('descargaGraficoInseminacionesXToro');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

      
        function cargarGraficoTorosMasHijos(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoHijosXToro');
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

                var my_anchor = document.getElementById('descargaGraficoHijosXToro');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };
        function cargarGraficoVacasInseminacionesFallidas(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoInseminacionesFallidas');
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

                var my_anchor = document.getElementById('descargaGraficoInseminacionesFallidas');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };
        function cargarGraficoVacasMasHijos(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoHijosXVaca');
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

                var my_anchor = document.getElementById('descargaGraficoHijosXVaca');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };
        function cargarGraficoAbortosXVaca(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoAbortosXVaca');
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

    }//fin controlador
})();
