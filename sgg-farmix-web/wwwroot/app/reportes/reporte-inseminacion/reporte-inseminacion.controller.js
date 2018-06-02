(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteInseminacionController', reporteInseminacionController);

    reporteInseminacionController.$inject = ['$scope', 'reporteInseminacionService'];

    function reporteInseminacionController($scope, reporteInseminacionService) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        vm.disabledExportar = 'disabled';
        vm.itemsPorPagina = 50;
        vm.tablaActiva = 0;
        vm.hembrasParaServir = [{
            "orden": 1,
            "caravana": 12133,
            "raza": "Rosa Pennington",
            "categoria": "Fran Tran",
            "edad": "1 años 5 meses",
            "peso": 326,
            "estado": "Shelly Mclaughlin",
            "rodeo": "Georgia",
            "partos": 1
        }];
        vm.lactanciasActivas = [];
        vm.preniadas = [];
        vm.serviciosSinConfirmar = [];


        inicializar()


        function inicializar() {
            $scope.$parent.unBlockSpinner();
            //reporteInseminacionService.inicializar({
            //    idAmbitoEstado: '1',
            //    idCampo: $localStorage.usuarioInfo.codigoCampo
            //}, function (data) {
            //    vm.rowCollection = data.bovinos;

            //    vm.showSpinner = true;
            //}, function error(error) {
            //    vm.showSpinner = false;
            //    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            //});
        }//inicializar


    }
})();