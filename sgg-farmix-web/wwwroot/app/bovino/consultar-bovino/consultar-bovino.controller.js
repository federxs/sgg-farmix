(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope', 'registrarBovinoService', 'toastr'];

    function consultarBovinoController($scope, registrarBovinoService, toastr) {
        var vm = $scope;
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.listaBovinos = [];
        vm.filtro = {};

        function inicializar() {
            registrarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.filtro.idCategoria = '0';
                vm.filtro.genero = '2';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                consultar();
            });
            //vm.bovino = new registrarBovinoService();
        };

        function consultar() {
            if (vm.filtro.peso === '') vm.filtro.peso = 0;
            registrarBovinoService.obtenerListaBovinos({ 'filtro': angular.toJson(vm.filtro,false) }, function (data) {
                vm.listaBovinos = data;
                vm.filtro.peso = '';
            }, function (error) {
                toastr.error('Error: ' + error, 'Error');
            });
        };        
    }
})();