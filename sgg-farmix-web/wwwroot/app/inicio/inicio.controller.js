﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('inicioController', inicioController);

    inicioController.$inject = ['$scope', 'inicioService', 'toastr', '$localStorage', '$state'];

    function inicioController($scope, inicioService, toastr, $localStorage, $state) {
        $scope.showSpinner = true;
        $scope.myChartObject = {};
        $scope.inicializar = inicializar();
        $scope.irAConflictos = irAConflictos;
        $scope.prueba = prueba;

        function inicializar() {
            $scope.showSpinner = true;
            inicioService.inicializar($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                $scope.cantBovinos = data.bovinos;
                $scope.cantEventos = data.eventos;
                $scope.cantVentas = data.ventas;
                $scope.vacasPreniadas = data.vacasPreniadas;
                cargarGraficoRazas(data.graficoRaza);
                cargarGraficoCategorias(data.graficoCategorias);
                $scope.showSpinner = false;
                inicioService.obtenerInconsistencias($localStorage.usuarioInfo.codigoCampo)
                   .then(function success(data) {
                       if (data.inconsistencias > 0) {
                           $scope.inconsistencias = data.inconsistencias;
                           $('#modalInconsistencias').modal('show');
                       }
                   }, function error(error) {
                       toastr.error("Se ha producido un error, reintentar.");
                   });
            }, function error(error) {
                $scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function cargarGraficoRazas(graficoRaza) {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoRazas');
                var chart = new google.visualization.PieChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Raza' });
                dataTable.addColumn({ type: 'number', id: 'Cantidad' });
                for (var i = 0; i < graficoRaza.length; i++) {
                    dataTable.addRows([[graficoRaza[i].raza, graficoRaza[i].cantidadBovinos]]);
                }

                var options = {
                    'width': '100%',
                    'height': '100%',
                    'chartArea': { 'width': '100%', 'height': '100%' },
                    'legend': {
                        'position': 'left',
                        'textStyle': { 'fontSize': 18 }
                    }
                };
                chart.draw(dataTable, options);
            }
        }

        /*function cargarGraficoRazas(graficoRaza) {
            $scope.myChartObject.type = "PieChart";
            $scope.myChartObject.options = {
                'width': '100%',
                'height': '100%',
                'chartArea': { 'width': '100%', 'height': '100%' },
                'legend': {
                    'position': 'left',
                    'textStyle': { 'fontSize': 18 }
                }
            };
            $scope.myChartObject.data = {
                "cols": [
                { id: "t", label: "Raza", type: "string" },
                { id: "s", label: "Cantidad", type: "number" }
                ], "rows": []
            }
            var total = 0;
            for (var i = 0; i < graficoRaza.length; i++) {
                total += graficoRaza[i].cantidadBovinos;
            }
            for (var i = 0; i < graficoRaza.length; i++) {
                $scope.myChartObject.data.rows.push({ c: [{ v: graficoRaza[i].raza }, { v: parseFloat((graficoRaza[i].cantidadBovinos * 100) / total) }] })
            }
        }

        function cargarGraficoCategorias(graficoCatego) {
            //grafico de barras de categorias
            $scope.graficoCategorias = {};
            $scope.graficoCategorias.type = "ColumnChart";
            $scope.graficoCategorias.options = {
                //'theme': 'maximized',
                'width': '100%',
                'height': '100%',
                //'chartArea': { 'left': 50, 'top': 30, 'right': 0, 'bottom': 50 },
                'hAxis': { 'textPosition': 'out' }
            };
            $scope.graficoCategorias.data = {
                "cols": [
                    { id: "t", label: "Categorías", type: "string" },
                    { id: "s", label: "Cantidad", type: "number" }
                ], "rows": []
            }
            for (var i = 0; i < graficoCatego.length; i++) {
                $scope.graficoCategorias.data.rows.push({ c: [{ v: graficoCatego[i].categoria }, { v: graficoCatego[i].cantidad }] });
            }
        }*/

        function cargarGraficoCategorias(graficoCatego) {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCategorias');
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Categoria', label: 'Categorias' });
                dataTable.addColumn({ type: 'number', id: 'Cantidad', label: 'Cantidad de bovinos' });
                for (var i = 0; i < graficoCatego.length; i++) {
                    dataTable.addRows([[graficoCatego[i].categoria, graficoCatego[i].cantidad]]);
                }

                var options = {
                    'theme': 'maximized',
                    'width': '100%',
                    'height': '100%',
                    //'chartArea': { 'left': 50, 'top': 30, 'right': 0, 'bottom': 50 },
                    'hAxis': { 'textPosition': 'out' }
                };
                chart.draw(dataTable, options);
            }
        }

        function irAConflictos() {
            $('#modalInconsistencias').modal('hide');
            $state.go('home.consultarConflicto');
        };

        function prueba() {
            inicioService.prueba($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                var hola = data;
            })
        }
    }//fin controlador
})();
