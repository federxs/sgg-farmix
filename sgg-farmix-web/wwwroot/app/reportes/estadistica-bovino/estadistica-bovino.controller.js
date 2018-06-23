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

        init();

        function init() {
            cargarGraficoPesoPorRazaYSexo();
        }

        function cargarGraficoPesoPorRazaYSexo(datos) {
            var datos = [{
                'N': 'Herbert',
                'Id1': 2,
                'Id2': 3
            },
            {
                'N': 'rangus',
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

                dataTable.addColumn({ type: 'string', id: 'N' });
                dataTable.addColumn({ type: 'number', id: 'Id1' });
                dataTable.addColumn({ type: 'number', id: 'Id2' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].N, datos[i].Id1, datos[i].Id2]]);
                }

                var options = {
                    'title': 'Peso promedio según raza y sexo',
                    hAxis: {
                        title: 'Peso en kg.'
                    },
                    vAxis: {
                        title: 'Razas'
                    }
                };
                chart.draw(dataTable, options);
            }
        };

        function cargarGraficoBajasPorAnio(datos) {
            var datos = [{
                'N': 'Herbert',
                'Id1': 2,
                'Id2': 3
            },
            {
                'N': 'rangus',
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

                dataTable.addColumn({ type: 'string', id: 'N' });
                dataTable.addColumn({ type: 'number', id: 'Id1' });
                dataTable.addColumn({ type: 'number', id: 'Id2' });

                for (var i = 0; i < datos.length; i++) {
                    dataTable.addRows([[datos[i].N, datos[i].Id1, datos[i].Id2]]);
                }

                var options = {
                    'title': 'Peso promedio según raza y sexo'
                };
                chart.draw(data, options);
            }
        };
    }//fin controlador
})();
