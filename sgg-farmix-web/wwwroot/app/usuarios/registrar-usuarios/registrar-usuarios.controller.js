(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarUsuariosController', registrarUsuariosController);

    registrarUsuariosController.$inject = ['$scope'];

    function registrarUsuariosController($scope) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;


        //metodos
        vm.inicializar = inicializar;
        vm.registrar = registrar;
        inicializar();

        function inicializar() {
            vm.showSpinner = false;
        }

        function registrar() { }

        function validar() { }
    }
})();
