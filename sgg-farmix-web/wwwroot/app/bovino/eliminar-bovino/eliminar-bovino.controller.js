(function () {
    'use strict';

    angular
        .module('app')
        .controller('eliminarBovinoController', eliminarBovinoController);

    eliminarBovinoController.$inject = ['$location', 'eliminarBovinoService'];

    function eliminarBovinoController($location, eliminarBovinoService) {
        var vm = this;
        vm.tipoEliminacion = true;
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.fechaDeHoy = new Date();
    }
})();
