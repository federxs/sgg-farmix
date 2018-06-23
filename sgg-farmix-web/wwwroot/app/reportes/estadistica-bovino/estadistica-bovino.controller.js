(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaBovinoController', estadisticaBovinoController);

    estadisticaBovinoController.$inject = ['$location', '$scope'];

    function estadisticaBovinoController($location, $scope) {
        var vm = $scope;
        vm.title = 'estadisticaBovinoController';

        vm.cargarGraficoPesoPorRazaYSexo = cargarGraficoPesoPorRazaYSexo();
        vm.cargarGraficoBajasPorAnio = cargarGraficoBajasPorAnio();

        init();

        function init() {
            cargarGraficoPesoPorRazaYSexo();
            cargarGraficoBajasPorAnio();
            cargarTablaAlimentosMasConsumidos();
            cargarGraficoPorcentajeBovinoPorRodeo();
        }

        function cargarGraficoPesoPorRazaYSexo(datos) {
            var datos = [{
                'N': 'Herbert',
                'Id1': 2,
                'Id2': 3
            },
            {
                'N': 'Brangus',
                'Id1': 2,
                'Id2': 3
            },
            {
                'N': 'Angus',
                'Id1': 2,
                'Id2': 3
            }];

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
                    dataTable.addRows([[datos[i].N, datos[i].Id1, datos[i].Id2]]);
                }

                var options = {
                    'title': 'Peso promedio según raza y sexo',
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
            }
        };

        function cargarGraficoBajasPorAnio(datos) {
            var datos = [{
                'anio': '2015',
                'muertes': 5,
                'ventas': 3
            },
            {
                'anio': '2016',
                'muertes': 8,
                'ventas': 5
            },
            {
                'anio': '2017',
                'muertes': 4,
                'ventas': 1
            },
            {
                'anio': '2018',
                'muertes': 4,
                'ventas': 7
            }];

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoBajasPorAnio');
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'anio', label: 'Año', type: 'string' });
                dataTable.addColumn({ id: 'muertes', label: 'Muertes', type: 'number' });
                dataTable.addColumn({ id: 'ventas', label: 'Ventas', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].anio, datos[i].muertes, datos[i].ventas]]);
                }

                var options = {
                    'title': 'Cantidad de bajas por año',
                    hAxis: {
                        title: 'Años'
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
            }
        };

        function cargarGraficoPorcentajeBovinoPorRodeo() {
            var datos = [{
                'rodeo': 'Preniadas',
                'porcentaje': 25
            },
            {
                'rodeo': 'Rodeo1',
                'porcentaje': 25
            },
            {
                'rodeo': 'Rodeo2',
                'porcentaje': 10
            },
            {
                'rodeo': 'Rodeo3',
                'porcentaje': 40
            }];

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoPorcentajeBovinoPorRodeo');
                var chart = new google.visualization.PieChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ id: 'rodeo', label: 'Rodeo', type: 'string' });
                dataTable.addColumn({ id: 'porcentaje', label: 'Porcentaje', type: 'number' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].rodeo, datos[i].porcentaje]]);
                }

                var options = {
                    'title': 'Porcentaje de bovinos por Rodeo',
                    pieHole: 0.4
                };
                chart.draw(dataTable, options);
            }
        }

        function cargarTablaAlimentosMasConsumidos(datos) {
            var datos = [{
                'alimento': 'Caca de perro',
                'cantidad': 104
            },
            {
                'alimento': 'Caca de gallina',
                'cantidad': 45
            },
            {
                'alimento': 'Caca de lukini',
                'cantidad': 20
            },
            {
                'alimento': 'Caca de lurilu',
                'cantidad': 5
            },
            {
                'alimento': 'Caca de guere',
                'cantidad': 1
            }];

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
    }//fin controlador
})();
