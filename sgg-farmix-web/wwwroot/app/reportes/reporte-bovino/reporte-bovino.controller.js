(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', 'exportador'];

    function reporteBovinoController($scope, reporteBovinoService, exportador) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        vm.showSpinner = true;
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;


        inicializar()


        function inicializar() {
            reporteBovinoService.inicializar({
                idAmbitoEstado: '1',
                idCampo: $localStorage.usuarioInfo.codigoCampo
            }, function (data) {
                vm.rowCollection = data.bovinos;

                vm.showSpinner = true;
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//inicializar

    }
})();