(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaBovinoController', estadisticaBovinoController);

    estadisticaBovinoController.$inject = ['$location', '$scope', '$localStorage', 'estadisticaBovinoService'];

    function estadisticaBovinoController($location, $scope, $localStorage, estadisticaBovinoService) {
        var vm = $scope;
        vm.title = 'estadisticaBovinoController';

        init();

        function init() {
            $scope.$parent.blockSpinner();
            estadisticaBovinoService.inicializar({ codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta }, function (data) {
                var obj = data;
                cargarGraficoPesoPorRazaYSexo(obj.pesosPromXRaza);
                cargarGraficoBajasPorMes(obj.bajasXMes);
                cargarTablaAlimentosMasConsumidos(obj.top10Alimentos);
                cargarGraficoPorcentajeBovinoPorRodeo(obj.bovinosXRodeo);
                cargarGraficoNacimientosPorMes(obj.nacimientos);
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function cargarGraficoPesoPorRazaYSexo(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoPesoPorRazaYSexo');
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

                var my_anchor = document.getElementById('descargaGraficoPesoPorRazaYSexo');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoBajasPorMes(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoBajasPorMes');
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

                var my_anchor = document.getElementById('descargaGraficoBajasPorMes');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };

        function cargarGraficoPorcentajeBovinoPorRodeo(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoPorcentajeBovinoPorRodeo');
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

                var my_anchor = document.getElementById('descargaGraficoPorcentajeBovinoPorRodeo');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }

        function cargarTablaAlimentosMasConsumidos(data) {
            var datos = data;
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('tablaAlimentosMasConsumidos');
                var table = new google.visualization.Table(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'alimento', label: 'Alimento', type: 'string' });
                dataTable.addColumn({ id: 'cantidad', label: 'Cantidad', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].alimento, datos[i].cantidad]]);
                }

                table.draw(dataTable, { showRowNumber: true, width: '100%', height: '100%' });
            }
        };

        function cargarGraficoNacimientosPorMes(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoNacimientosPorMes');
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

                var my_anchor = document.getElementById('descargaGraficoNacimientosPorMes');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }


        }

    }//fin controlador
})();
