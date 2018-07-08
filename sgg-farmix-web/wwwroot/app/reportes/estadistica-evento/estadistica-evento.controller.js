(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaEventoController', estadisticaEventoController);

    estadisticaEventoController.$inject = ['$location', '$scope', '$localStorage', 'estadisticaEventoService', 'toastr'];

    function estadisticaEventoController($location, $scope, $localStorage, estadisticaEventoService, toastr) {
        var vm = $scope;
        vm.title = 'estadisticaEventoController';
        window.scrollTo(0, 0);
        init();

        function init() {
            $scope.$parent.blockSpinner();
            estadisticaEventoService.inicializar({
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                $scope.obj = data;                
                cargarGraficoAntibioticosMasUsados($scope.obj.antibioticosMasUsados);
                cargarGraficoCambiosAlimentacionXBovino($scope.obj.cambiosAlimentacionXBovino);
                cargarGraficoMovimientosXBovino($scope.obj.movimientosXBovino);
                cargarGraficoEventosXTipoXMes($scope.obj.eventosXTipoXMes);
                cargarGraficoEventosXTipoXGenero($scope.obj.eventosXTipoXGenero);
                cargarGraficoVacunasMenosUsadas($scope.obj.vacunasMenosUsadas);
                cargarGraficotop10Alimentos($scope.obj.top10Alimentos);
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function cargarGraficoAntibioticosMasUsados(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoAntibioticosMasUsados');
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

                var my_anchor = document.getElementById('descargaGraficoAntibioticosMasUsados');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }

        function cargarGraficoCambiosAlimentacionXBovino(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCambiosAlimentacionXBovino');
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

        function cargarGraficoMovimientosXBovino(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoMovimientosXBovino');
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

                var my_anchor = document.getElementById('descargaGraficoMovimientosXBovino');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        };
        function cargarGraficoEventosXTipoXMes(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoEventosXTipoXMes');
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

                //var my_anchor = document.getElementById('descargaGraficoEventosXTipoXMes');
                //my_anchor.href = chart.getImageURI();
                //google.visualization.events.addListener(chart, 'ready', function () {
                //    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                //});
            }
        }

        function cargarGraficoEventosXTipoXGenero(data){
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoEventosXTipoXGenero');
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

                var my_anchor = document.getElementById('descargaGraficoEventosXTipoXGenero');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }
        function cargarGraficotop10Alimentos(data) {
            var datos = data;

            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficotop10Alimentos');
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
    
        function cargarGraficoVacunasMenosUsadas(data){
            var datos = data;

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoVacunasMenosUsadas');
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
                    height: 300,
                    bar: { groupWidth: '10%' },
                    vAxis: { gridlines: { count: 4 }, format: 'decimal', title: 'Cantidad' },
                    hAxis: {
                        title: 'Vacunas',
                        viewWindow: { min: 0 }
                    },
                    colors: ["#ff5c33"]

                };
                chart.draw(dataTable, options);

                var my_anchor = document.getElementById('descargaGraficoVacunasMenosUsadas');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }
    }//fin controlador
})();
