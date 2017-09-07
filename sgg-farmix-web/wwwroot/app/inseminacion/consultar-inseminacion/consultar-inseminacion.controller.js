(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService'];

    function consultarInseminacionController($scope, consultarInseminacionService) {
        var vm = $scope;
        //variables
        //metodos
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() { }
    }
})();
