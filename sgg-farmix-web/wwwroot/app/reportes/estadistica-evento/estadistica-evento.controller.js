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

        vm.descargarPdf = descargarPdf;

        function init() {
            $scope.ano = $localStorage.usuarioInfo.periodoConsulta;
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
                    my_anchor.innerHTML = '<img id="descargaGraficoAntibioticosMasUsadosImg" src="' + chart.getImageURI() + '">';
                });

                // open the PDF in a new window
                var docDefinition = {
                    content: [
                      {
                          // you'll most often use dataURI images on the browser side
                          // if no width/height/fit is provided, the original size will be used
                          image: 'data:image/png;base64,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'
                      }
                    ]
                };
                pdfMake.createPdf(docDefinition).open();
                pdfMake.createPdf(docDefinition).download('optionalName.pdf');
            }
        }

        function descargarPdf(idDeImagen) {
            var imgSrc = document.getElementById("idDeImagen").src;
            var docDefinition = {
                content: [
                  {
                      image: imgSrc
                  }
                ]
            };
            pdfMake.createPdf(docDefinition).download('optionalName.pdf');
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

        function cargarGraficoEventosXTipoXGenero(data) {
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

        function cargarGraficoVacunasMenosUsadas(data) {
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

                var my_anchor = document.getElementById('descargaGraficoVacunasMenosUsadas');
                my_anchor.href = chart.getImageURI();
                google.visualization.events.addListener(chart, 'ready', function () {
                    my_anchor.innerHTML = '<img src="' + chart.getImageURI() + '">';
                });
            }
        }
    }//fin controlador
})();
