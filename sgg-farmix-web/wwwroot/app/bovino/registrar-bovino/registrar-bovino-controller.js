(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService'];

    function registrarBovinoController($scope, registrarBovinoService) {
        var vm = $scope;
        inicializar();
        vm.registrar = registrar;
        vm.validar = validar;
        vm.nombre = 'prueba';
        //vm.inicializar = inicializar;

        
        function inicializar() {
        }

        function registrar() {

        }

        function validar() {

        }
    }
})();