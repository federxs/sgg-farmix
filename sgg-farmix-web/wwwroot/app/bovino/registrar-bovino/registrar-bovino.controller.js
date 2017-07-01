(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService'];

    function registrarBovinoController($scope, registrarBovinoService) {
        var vm = $scope;
        //funciones
        vm.registrar = registrar;
        vm.validar = validar;
        vm.inicializar = inicializar;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        //vm.inicializar = inicializar;
        //inicializar();
        vm.inicializar();

        function inicializar() {
            registrarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
            });
            vm.bovino = new registrarBovinoService();
        };

        function registrar() {            
            vm.bovino.$save(function (data) {

            });

        }

        function validar() {

        }
    }
})();