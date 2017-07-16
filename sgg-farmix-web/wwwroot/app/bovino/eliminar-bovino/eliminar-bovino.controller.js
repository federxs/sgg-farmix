(function () {
    'use strict';

    angular
        .module('app')
        .controller('eliminarBovinoController', eliminarBovinoController);

    eliminarBovinoController.$inject = ['$scope', 'eliminarBovinoService'];

    function eliminarBovinoController($scope, eliminarBovinoService) {
        var vm = $scope;
        vm.tiposEliminacion = [
            { id: 1, nombre: 'Venta' },
            { id: 2, nombre: 'Defunción' }
        ];
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.fechaDeHoy = new Date();
    }
})();
