(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleUsuariosController', detalleUsuariosController);

    detalleUsuariosController.$inject = ['$scope'];

    function detalleUsuariosController($scope) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;


        //metodos
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() {
            vm.showSpinner = false;
        }

    }
})();
