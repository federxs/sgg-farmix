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
        vm.hembrasParaServir = [];
        vm.lactanciasActivas = [];
        vm.preniadas = [];
        vm.serviciosSinConfirmar = [];


        inicializar()


        function inicializar() {
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