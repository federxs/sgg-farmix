﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('inicioController', inicioController);

    inicioController.$inject = ['$scope', 'inicioService', 'toastr', '$localStorage', '$state', '$timeout'];

    function inicioController($scope, inicioService, toastr, $localStorage, $state, $timeout) {
        window.scrollTo(0, 0);
        $('.modal-backdrop').remove();
        $('[data-toggle="tooltip"]').tooltip();
        $scope.myChartObject = {};
        $scope.inicializar = inicializar();
        $scope.irAConflictos = irAConflictos;
        $scope.cerrar = cerrar;
        $scope.prueba = prueba;
        $scope.ano = new Date().getFullYear();
        if (!$localStorage.usuarioInfo.periodoConsulta)
            $localStorage.usuarioInfo.periodoConsulta = $scope.ano;
        else
            $scope.ano = $localStorage.usuarioInfo.periodoConsulta;

        function inicializar() {
            $scope.$parent.blockSpinner();
            inicioService.inicializar($localStorage.usuarioInfo.codigoCampo, $localStorage.usuarioInfo.periodoConsulta).then(function success(data) {
                $scope.cantBovinos = data.bovinos;
                $scope.cantEventos = data.eventos;
                $scope.cantVentas = data.ventas;
                $scope.vacasPreniadas = data.vacasPreniadas;
                cargarGraficoRazas(data.graficoRaza);
                cargarGraficoCategorias(data.graficoCategorias);
                $scope.$parent.unBlockSpinner();
                inicioService.obtenerInconsistencias($localStorage.usuarioInfo.codigoCampo)
                   .then(function success(data) {
                       $scope.$parent.unBlockSpinner();
                       if (data.inconsistencias > 0) {
                           $scope.inconsistencias = data.inconsistencias;
                           $('#modalInconsistencias').modal('show');
                       }
                       $('.modal-backdrop').remove();
                   }, function error(error) {
                       $scope.$parent.errorServicio(error.statusText);
                   });
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function cerrar() {
            $timeout(function () {
                $('#modalInconsistencias').modal('hide');
            }, 500);
        };

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
        };

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
        };

        function irAConflictos() {
            $('#modalInconsistencias').modal('hide');
            $state.go('home.conflictos');
        };

        function prueba() {
            /*var inseminacion = { tipoInseminacion: 2, fechaInseminacion: '20180611', codigoCampo: 100 };
            var listaToros = '59';
            var listaVacas = '50';
            inicioService.prueba(inseminacion, listaVacas, listaToros).then(function success(data) {
                var hola = data;
            })*/
            var fechaNacimiento = '20180617';
            var listaMadres = '48';
            var toro = '';
            var codigoCampo = 100;
            inicioService.prueba(fechaNacimiento, listaMadres, toro, codigoCampo).then(function success(data) {
                var hola = data;
            })
        }
    }//fin controlador
})();
