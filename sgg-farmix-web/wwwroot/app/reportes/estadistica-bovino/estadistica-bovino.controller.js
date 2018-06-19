(function () {
    'use strict';

    angular
        .module('app')
        .controller('estadisticaBovinoController', estadisticaBovinoController);

    estadisticaBovinoController.$inject = ['$scope', 'estadisticaBovinoService', '$localStorage'];

    function estadisticaBovinoController($scope, estadisticaBovinoService, $localStorage) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        window.scrollTo(0, 0);
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;


        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            estadisticaBovinoService.inicializar({
                codigoCampo: $localStorage.usuarioInfo.codigoCampo
            }, function (data) {
                vm.rowCollection = data;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }
    }
})();