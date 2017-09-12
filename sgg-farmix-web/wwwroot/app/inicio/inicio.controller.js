(function () {
    'use strict';

    angular
        .module('app')
        .controller('inicioController', inicioController);

    inicioController.$inject = ['$scope', 'inicioService', 'toastr'];

    function inicioController($scope, inicioService, toastr) {
        $scope.myChartObject = {};
        $scope.inicializar = inicializar();


        function inicializar() {
            inicioService.inicializar().then(function success(data) {
                $scope.cantBovinos = data.bovinos;
                $scope.cantEventos = data.eventos;
                $scope.cantVentas = data.ventas;
                cargarGraficoRazas(data.graficoRaza);
                cargarGraficoCategorias(data.graficoCategorias);
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function cargarGraficoRazas(graficoRaza) {
            $scope.myChartObject.type = "PieChart";
            $scope.myChartObject.options = {
                'width': 600,
                'height': 400,
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
                'theme': 'maximized',
                //'width': 600,
                'height': 400,
                'chartArea': { 'left': 50, 'top': 30, 'right': 0, 'bottom': 50 },
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
        }
    }//fin controlador
})();
