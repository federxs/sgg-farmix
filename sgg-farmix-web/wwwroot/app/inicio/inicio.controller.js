(function () {
    'use strict';

    angular
        .module('app')
        .controller('inicioController', inicioController);

    inicioController.$inject = ['$scope'];

    function inicioController($scope) {
        //var vm = this;
        $scope.myChartObject = {};
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
            ], "rows": [
                {
                    c: [
                       { v: "Aberdeen Angus" },
                       { v: 30 },
                    ]
                },
                {
                    c: [
                         { v: "Hereford" },
                         { v: 42 },
                    ]
                },
                {
                    c: [
                       { v: "Brahman" },
                       { v: 16 },
                    ]
                },
                {
                    c: [
                       { v: "Limousin" },
                       { v: 15 }
                    ]
                },
                {
                    c: [
                       { v: "Brangus" },
                       { v: 19 },
                    ]
                }
            ]
        };

        //grafico de barras de categorias
        $scope.graficoCategorias = {};
        $scope.graficoCategorias.type = "ColumnChart";
        $scope.graficoCategorias.options = {
            'theme': 'maximized',
            //'width': 600,
            'height': 400,
            'chartArea': { 'left': 50, 'top': 30, 'right': 0, 'bottom':50},
            'hAxis': { 'textPosition': 'out' }
        };
        $scope.graficoCategorias.data = {
            "cols": [
                { id: "t", label: "Categorías", type: "string" },
                { id: "s", label: "Cantidad", type: "number" }
            ], "rows": [
                {
                    c: [
                       { v: "Ternera" },
                       { v: 3 },
                    ]
                },
                {
                    c: [
                       { v: "Vaquillona" },
                       { v: 21 }
                    ]
                },
                {
                    c: [
                       { v: "Vaca Joven" },
                       { v: 31 }
                    ]
                },
                {
                    c: [
                       { v: "Vaca Adulta" },
                       { v: 31 }
                    ]
                },
                {
                    c: [
                       { v: "Vaca Conserva" },
                       { v: 5 },
                    ]
                },
                {
                    c: [
                       { v: "Novillito" },
                       { v: 2 },
                    ]
                },
                {
                    c: [
                       { v: "Novillo" },
                       { v: 6 },
                    ]
                },
                {
                    c: [
                       { v: "Torito" },
                       { v: 5 },
                    ]
                },
                {
                    c: [
                       { v: "Toro" },
                       { v: 10 },
                    ]
                }
            ]
        };
    }//fin controlador
})();
