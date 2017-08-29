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
            'title': 'Proporción de vacas según la raza'
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
    }
})();
