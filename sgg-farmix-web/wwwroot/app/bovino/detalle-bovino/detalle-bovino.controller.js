(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleBovinoController', detalleBovinoController);

    detalleBovinoController.$inject = ['$scope'];

    function detalleBovinoController($scope) {
        var vm = $scope;
        //funciones
        //variables
        vm.bovino = {};
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() {

        }


        function validar() {

        }
    }
})();