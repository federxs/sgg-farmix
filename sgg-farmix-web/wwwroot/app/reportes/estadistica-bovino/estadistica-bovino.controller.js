(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaBovinoController', estadisticaBovinoController);

    estadisticaBovinoController.$inject = ['$location', '$scope', '$localStorage', 'estadisticaBovinoService', 'toastr', '$sessionStorage'];

    function estadisticaBovinoController($location, $scope, $localStorage, estadisticaBovinoService, toastr, $sessionStorage) {
        var vm = $scope;
        vm.title = 'estadisticaBovinoController';
        window.scrollTo(0, 0);
        init();
        vm.descargarPdf = descargarPdf;

        function init() {
            $scope.$parent.blockSpinner();
            estadisticaBovinoService.inicializar({ codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta }, function (data) {
                $scope.obj = data;
                $scope.ano = $localStorage.usuarioInfo.periodoConsulta;
                cargarGraficoPesoPorRazaYSexo($scope.obj.pesosPromXRaza);
                cargarGraficoBajasPorMes($scope.obj.bajasXMes);
                cargarGraficoTop10BovinosMasLivianos($scope.obj.top10BovinosMasLivianos);
                cargarGraficoPorcentajeBovinoPorRodeo($scope.obj.bovinosXRodeo);
                cargarGraficoNacimientosPorMes($scope.obj.nacimientos);
                //cargarGraficoUltimosBovinosBajas($scope.obj.ultimosBovinosBajas);
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

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
        };

        function cargarGraficoTop10BovinosMasLivianos(data) {
            var datos = data;
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('top10BovinosMasLivianos');
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


        };

        function descargarPdf(idDeImagen, titulo) {
            var imgSrc = document.getElementById(idDeImagen).href;
            var fecha = new Date();
            var docDefinition = {
                content: [
                    {
                        image: 'data:image/jpeg;base64,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',
                        width: 280,
                        height: 70,
                        margin: [100, 5]
                    },
                    {
                        table: {
                            widths: ['*'],
                            body: [[" "], [" "]]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 2;
                            },
                            vLineWidth: function (i, node) {
                                return 0;
                            },
                        }
                    },
                    {
                        table: {
                            widths: ['auto', '*'],
                            headerRows: 1,
                            body: [
                                [{ text: titulo + '\n', fontSize: 15, bold: true, colSpan: 2, alignment: 'center' }, {}],
                                ['Campo:', { text: $localStorage.usuarioInfo.campoNombre, bold: true }],
                                ['Generado por:', { text: $sessionStorage.usuarioInfo.usuario, bold: true }],
                                ['Fecha:', { text: (fecha.getDate() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getFullYear()), bold: true }]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            // paddingLeft: function(i, node) { return 4; },
                            // paddingRight: function(i, node) { return 4; },
                            // paddingTop: function(i, node) { return 2; },
                            // paddingBottom: function(i, node) { return 2; },
                            // fillColor: function (i, node) { return null; }
                        }
                    },
                    {
                        margin: [0, 30, 0, 0],
                        table: {
                            widths: ['*'],
                            body: [
                              [{
                                  image: imgSrc,
                                  width: 500,
                                  height: 250
                              }]
                            ]
                        }
                    }
                ],
                styles: {
                    normal: {
                        fontSize: 13
                    }
                }
            };
            var GUION_SEPARADOR = ' - ';
            pdfMake.createPdf(docDefinition).download('Farmix' + GUION_SEPARADOR + $localStorage.usuarioInfo.campoNombre + GUION_SEPARADOR + titulo + GUION_SEPARADOR + (fecha.getDate() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getFullYear()) + '.pdf');
        };

    }//fin controlador
})();
