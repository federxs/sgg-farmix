(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarUsuariosController', modificarUsuariosController);

    modificarUsuariosController.$inject = ['$scope'];

    function modificarUsuariosController($scope) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;


        //metodos
        vm.inicializar = inicializar;
        vm.modificar = modificar;
        inicializar();

        function inicializar() {
            vm.showSpinner = false;
        }

        function modificar() { }

        function validar() { }
    }
})();
